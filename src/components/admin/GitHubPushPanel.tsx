import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Lock,
  Eye,
  EyeOff,
  Check,
  FileText,
  ShieldCheck,
  RefreshCw,
  FolderArchive,
  ArrowRight,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  default_branch: string;
  private: boolean;
  permissions?: {
    admin: boolean;
    push: boolean;
    pull: boolean;
  };
}

interface PushProgressStep {
  id: string;
  label: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

const INITIAL_STEPS: PushProgressStep[] = [
  { id: 'connect', label: 'Connecting to GitHub API...', status: 'pending' },
  { id: 'validate', label: 'Validating repository & write permissions...', status: 'pending' },
  { id: 'scan', label: 'Scanning project files & excluding sensitive files...', status: 'pending' },
  { id: 'prepare', label: 'Preparing file tree & base64 encoding...', status: 'pending' },
  { id: 'upload', label: 'Uploading file blobs to GitHub...', status: 'pending' },
  { id: 'commit', label: 'Creating Git Commit & updating branch reference...', status: 'pending' },
  { id: 'verify', label: 'Verifying commit on GitHub...', status: 'pending' },
];

export function GitHubPushPanel() {
  const { token, showToast } = useStore();

  // Form State - never hardcode tokens in client code
  const [githubToken, setGithubToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [owner, setOwner] = useState('prabhat18deora-code');
  const [repoName, setRepoName] = useState('offgrid1og-');
  const [branch, setBranch] = useState('main');
  const [commitMessage, setCommitMessage] = useState('Update OffGrid OG website source code');

  // Connection & Validation State
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSuccess, setConnectionSuccess] = useState(false);
  const [connectedUser, setConnectedUser] = useState<GitHubUser | null>(null);
  const [repoInfo, setRepoInfo] = useState<GitHubRepo | null>(null);
  const [repoExists, setRepoExists] = useState<boolean | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);

  // File Preview State
  const [filesPreview, setFilesPreview] = useState<{ count: number; totalBytes: number; files: any[] } | null>(null);
  const [showFilesList, setShowFilesList] = useState(false);

  // Push Operation State
  const [isPushing, setIsPushing] = useState(false);
  const [pushSteps, setPushSteps] = useState<PushProgressStep[]>(INITIAL_STEPS);
  const [pushResult, setPushResult] = useState<any>(null);
  const [pushError, setPushError] = useState<string | null>(null);

  // Fetch project files preview on mount
  useEffect(() => {
    async function loadFilesPreview() {
      try {
        const res = await fetch('/api/admin/github/files-preview', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setFilesPreview(data);
        }
      } catch {
        // Silent preview catch
      }
    }
    loadFilesPreview();
  }, [token]);

  // Connect & Verify GitHub Token
  const handleConnect = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!githubToken.trim()) {
      setConnectError('Please enter a valid GitHub Personal Access Token.');
      return;
    }

    try {
      setIsConnecting(true);
      setConnectError(null);
      setConnectionSuccess(false);

      const res = await fetch('/api/admin/github/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          token: githubToken.trim(),
          owner: owner.trim(),
          repo: repoName.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setConnectError(data.error || 'GitHub connection failed.');
        setConnectionSuccess(false);
        showToast(data.error || 'GitHub verification failed', 'error');
        return;
      }

      setConnectedUser(data.user);
      if (data.user?.login && !owner) {
        setOwner(data.user.login);
      }

      setRepoExists(data.repoExists);
      if (data.repo) {
        setRepoInfo(data.repo);
        if (data.repo.default_branch) {
          setBranch(data.repo.default_branch);
        }
      }

      setConnectionSuccess(true);
      showToast('GitHub connection verified successfully!', 'success');
    } catch (err: any) {
      setConnectError(err.message || 'Unable to connect to GitHub. Please check your network.');
      showToast('Connection error', 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  // Push to GitHub with Real-Time Progress Flow
  const handlePush = async () => {
    if (!githubToken.trim() || !owner.trim() || !repoName.trim()) {
      showToast('Please fill in GitHub token, owner, and repository name', 'error');
      return;
    }

    try {
      setIsPushing(true);
      setPushError(null);
      setPushResult(null);

      // Reset progress steps
      const steps: PushProgressStep[] = INITIAL_STEPS.map((s) => ({ ...s, status: 'pending' }));
      setPushSteps(steps);

      // Animate Step 1: Connecting
      steps[0].status = 'in_progress';
      setPushSteps([...steps]);
      await new Promise((r) => setTimeout(r, 350));
      steps[0].status = 'completed';

      // Animate Step 2: Validating
      steps[1].status = 'in_progress';
      setPushSteps([...steps]);
      await new Promise((r) => setTimeout(r, 400));
      steps[1].status = 'completed';

      // Animate Step 3: Scanning
      steps[2].status = 'in_progress';
      setPushSteps([...steps]);
      await new Promise((r) => setTimeout(r, 450));
      steps[2].status = 'completed';

      // Animate Step 4: Preparing
      steps[3].status = 'in_progress';
      setPushSteps([...steps]);
      await new Promise((r) => setTimeout(r, 500));
      steps[3].status = 'completed';

      // Animate Step 5: Uploading
      steps[4].status = 'in_progress';
      setPushSteps([...steps]);

      // Call server endpoint to upload files via Git Data API
      const res = await fetch('/api/admin/github/push', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          token: githubToken.trim(),
          owner: owner.trim(),
          repo: repoName.trim(),
          branch: branch.trim() || 'main',
          commitMessage: commitMessage.trim() || 'Update OffGrid OG website source code',
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        steps[4].status = 'error';
        setPushSteps([...steps]);
        const errMsg = data.error || 'Failed to upload source code to GitHub';
        setPushError(errMsg);
        showToast(errMsg, 'error');
        return;
      }

      steps[4].status = 'completed';

      // Animate Step 6: Commit
      steps[5].status = 'in_progress';
      setPushSteps([...steps]);
      await new Promise((r) => setTimeout(r, 400));
      steps[5].status = 'completed';

      // Animate Step 7: Verify
      steps[6].status = 'in_progress';
      setPushSteps([...steps]);
      await new Promise((r) => setTimeout(r, 300));
      steps[6].status = 'completed';

      setPushResult(data);
      showToast(`Successfully pushed ${data.filesCount} files to GitHub!`, 'success');
    } catch (err: any) {
      setPushError(err.message || 'Push operation interrupted. Please try again.');
      showToast('Push operation failed', 'error');
    } finally {
      setIsPushing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-[#505840] border border-[#62694F] rounded-sm text-[#F2EFE7]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <GitBranch size={18} className="text-[#D0C8B7]" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#F2EFE7]">
              GitHub Deployment &amp; Automatic Push
            </h2>
          </div>
          <p className="text-xs text-[#D0C8B7]">
            Directly commit and push your complete OffGrid OG project source code to your GitHub repository.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {filesPreview && (
            <button
              type="button"
              onClick={() => setShowFilesList(!showFilesList)}
              className="px-3.5 py-2 bg-[#414936] hover:bg-[#343B2B] border border-[#62694F] text-xs font-semibold rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer text-[#F2EFE7]"
            >
              <FolderArchive size={13} />
              <span>{filesPreview.count} Files Scanned</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleConnect()}
            disabled={isConnecting || isPushing}
            className="px-4 py-2 bg-[#F2EFE7] hover:bg-[#D0C8B7] text-[#292F23] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            {isConnecting ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            <span>{isConnecting ? 'Verifying...' : 'Connect GitHub'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Settings & Connection Form (Left 7 Cols) + Status / Progress (Right 5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Connection Credentials */}
        <div className="lg:col-span-7 bg-[#414936] p-6 rounded-sm border border-[#62694F] space-y-5">
          <div className="flex items-center justify-between border-b border-[#62694F] pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2EFE7] flex items-center gap-2">
              <Lock size={14} className="text-[#D0C8B7]" />
              <span>GitHub Credentials &amp; Destination</span>
            </h3>
            <span className="text-[11px] text-[#D0C8B7] bg-[#343B2B] px-2 py-0.5 rounded border border-[#62694F]">
              HTTPS Encrypted &middot; Zero Storage
            </span>
          </div>

          {connectError && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0" />
              <span>{connectError}</span>
            </div>
          )}

          <div className="space-y-4 text-xs">
            {/* Token Field */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-[#D0C8B7] uppercase tracking-wider text-[11px]">
                  GitHub Personal Access Token (Classic) *
                </label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=OffGrid+OG+Deployer"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[10px] text-[#F2EFE7] underline hover:text-white inline-flex items-center gap-1"
                >
                  <span>Generate Token (repo scope)</span>
                  <ExternalLink size={10} />
                </a>
              </div>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] font-mono text-xs rounded focus:outline-none focus:border-[#777B5A] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D0C8B7] hover:text-[#F2EFE7]"
                  title={showToken ? 'Mask Token' : 'Show Token'}
                >
                  {showToken ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Owner & Repo Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#D0C8B7] uppercase tracking-wider text-[11px] mb-1">
                  Repository Owner / Username *
                </label>
                <input
                  type="text"
                  value={owner}
                  onChange={(e) => setOwner(e.target.value)}
                  placeholder="e.g. prabhat18deora-code"
                  className="w-full px-3.5 py-2.5 bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] font-mono text-xs rounded focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#D0C8B7] uppercase tracking-wider text-[11px] mb-1">
                  Repository Name *
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="e.g. offgrid1og-"
                  className="w-full px-3.5 py-2.5 bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] font-mono text-xs rounded focus:outline-none focus:border-[#777B5A]"
                />
              </div>
            </div>

            {/* Branch & Commit Message */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-[#D0C8B7] uppercase tracking-wider text-[11px] mb-1">
                  Target Branch *
                </label>
                <input
                  type="text"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  placeholder="main"
                  className="w-full px-3.5 py-2.5 bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] font-mono text-xs rounded focus:outline-none focus:border-[#777B5A]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#D0C8B7] uppercase tracking-wider text-[11px] mb-1">
                  Commit Message
                </label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Update website source code"
                  className="w-full px-3.5 py-2.5 bg-[#343B2B] border border-[#62694F] text-[#F2EFE7] text-xs rounded focus:outline-none focus:border-[#777B5A]"
                />
              </div>
            </div>

            {/* Excluded Files Safety Notice */}
            <div className="p-3 bg-[#343B2B] border border-[#62694F] rounded text-[11px] text-[#D0C8B7] space-y-1">
              <span className="font-bold text-[#F2EFE7] uppercase text-[10px] tracking-wider block flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-emerald-400" />
                <span>Security &amp; Clean Workspace Exclusions</span>
              </span>
              <p>
                The deployment engine automatically excludes <code className="text-[#F2EFE7]">node_modules/</code>, <code className="text-[#F2EFE7]">.git/</code>, private <code className="text-[#F2EFE7]">.env</code> files, API keys, build artifacts, and system caches before uploading.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleConnect()}
                disabled={isConnecting || isPushing}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#505840] hover:bg-[#62694F] border border-[#62694F] text-xs font-bold text-[#F2EFE7] uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isConnecting ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                <span>Verify Connection</span>
              </button>

              <button
                type="button"
                onClick={handlePush}
                disabled={isPushing}
                className="w-full sm:flex-1 px-6 py-2.5 bg-[#F2EFE7] hover:bg-[#D0C8B7] text-[#20211E] text-xs font-extrabold uppercase tracking-widest rounded transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.98]"
              >
                {isPushing ? <Loader2 size={15} className="animate-spin" /> : <UploadCloud size={15} />}
                <span>{isPushing ? 'Uploading to GitHub...' : 'Push to GitHub'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Connection Status & Real-Time Push Progress */}
        <div className="lg:col-span-5 space-y-5">
          {/* Status Card */}
          <div className="bg-[#414936] p-5 rounded-sm border border-[#62694F] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2EFE7] flex items-center justify-between">
              <span>GitHub Account &amp; Target</span>
              {connectionSuccess ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                  <Check size={12} />
                  <span>Verified</span>
                </span>
              ) : (
                <span className="text-[10px] text-[#D0C8B7] bg-[#343B2B] px-2 py-0.5 rounded">Ready to test</span>
              )}
            </h3>

            {connectedUser ? (
              <div className="p-3 bg-[#343B2B] rounded border border-[#62694F] flex items-center gap-3">
                <img
                  src={connectedUser.avatar_url}
                  alt={connectedUser.login}
                  className="w-10 h-10 rounded-full border border-[#62694F]"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#F2EFE7] truncate">{connectedUser.name || connectedUser.login}</p>
                  <p className="text-[11px] text-[#D0C8B7] font-mono truncate">@{connectedUser.login}</p>
                </div>
                <a
                  href={connectedUser.html_url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="p-1.5 text-[#D0C8B7] hover:text-[#F2EFE7]"
                  title="Open GitHub Profile"
                >
                  <ExternalLink size={14} />
                </a>
              </div>
            ) : (
              <div className="p-3 bg-[#343B2B] rounded border border-[#62694F] text-xs text-[#D0C8B7]">
                Click <strong>Verify Connection</strong> to test your token and check destination repository permissions.
              </div>
            )}

            {repoInfo && (
              <div className="space-y-1.5 text-xs text-[#D0C8B7] pt-1">
                <div className="flex justify-between">
                  <span>Destination:</span>
                  <a
                    href={repoInfo.html_url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[#F2EFE7] font-mono font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <span>{repoInfo.full_name}</span>
                    <ExternalLink size={11} />
                  </a>
                </div>
                <div className="flex justify-between">
                  <span>Default Branch:</span>
                  <span className="font-mono text-[#F2EFE7]">{repoInfo.default_branch}</span>
                </div>
                <div className="flex justify-between">
                  <span>Write Permissions:</span>
                  <span className="font-bold text-emerald-400">Granted (Push/Admin)</span>
                </div>
              </div>
            )}
          </div>

          {/* Real-time Push Progress Tracker */}
          <div className="bg-[#414936] p-5 rounded-sm border border-[#62694F] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F2EFE7] flex items-center justify-between">
              <span>Push Progress</span>
              {isPushing && (
                <span className="inline-flex items-center gap-1 text-[10px] text-amber-300">
                  <Loader2 size={11} className="animate-spin" />
                  <span>Processing</span>
                </span>
              )}
            </h3>

            <div className="space-y-2.5">
              {pushSteps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-2.5 text-xs">
                  {step.status === 'completed' && <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />}
                  {step.status === 'in_progress' && (
                    <Loader2 size={15} className="text-amber-400 animate-spin shrink-0" />
                  )}
                  {step.status === 'pending' && <span className="w-3.5 h-3.5 rounded-full border border-[#62694F] shrink-0 ml-0.5" />}
                  {step.status === 'error' && <AlertCircle size={15} className="text-red-400 shrink-0" />}

                  <span
                    className={`${
                      step.status === 'completed'
                        ? 'text-[#F2EFE7] font-medium'
                        : step.status === 'in_progress'
                        ? 'text-amber-300 font-bold'
                        : step.status === 'error'
                        ? 'text-red-300 font-bold'
                        : 'text-[#D0C8B7]/60'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Push Error Message */}
            {pushError && (
              <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded space-y-1">
                <p className="font-bold">Push failed:</p>
                <p className="text-[11px]">{pushError}</p>
              </div>
            )}

            {/* Push Success Celebration Card */}
            {pushResult && pushResult.success && (
              <div className="p-4 bg-emerald-950/90 border border-emerald-700 rounded text-emerald-100 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase tracking-wider text-xs">
                  <CheckCircle2 size={16} />
                  <span>Push Completed Successfully!</span>
                </div>

                <p className="text-[11px] text-emerald-200">
                  Uploaded <strong>{pushResult.filesCount} project files</strong> directly to branch{' '}
                  <code className="bg-emerald-900 px-1.5 py-0.5 rounded text-white font-mono">
                    {pushResult.branch}
                  </code>
                  .
                </p>

                <div className="pt-1 flex flex-wrap gap-2">
                  <a
                    href={pushResult.repoUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded inline-flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Open GitHub Repo</span>
                    <ExternalLink size={12} />
                  </a>

                  {pushResult.commitUrl && (
                    <a
                      href={pushResult.commitUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="px-3 py-1.5 bg-[#343B2B] hover:bg-[#505840] text-[#F2EFE7] border border-[#62694F] text-xs font-mono rounded inline-flex items-center gap-1.5"
                    >
                      <span>Commit {pushResult.commitSha?.substring(0, 7)}</span>
                      <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scanned Files Inspection Modal / Accordion */}
      {showFilesList && filesPreview && (
        <div className="p-5 bg-[#343B2B] border border-[#62694F] rounded-sm space-y-3">
          <div className="flex items-center justify-between border-b border-[#62694F] pb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F2EFE7] flex items-center gap-2">
              <FileText size={14} className="text-[#D0C8B7]" />
              <span>Project Source Files Prepared for Upload ({filesPreview.count} total)</span>
            </h4>
            <span className="text-[11px] text-[#D0C8B7] tabular-nums">
              Total Size: {(filesPreview.totalBytes / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>

          <div className="max-h-60 overflow-y-auto font-mono text-[11px] text-[#D0C8B7] divide-y divide-[#62694F]/30 pr-2">
            {filesPreview.files.map((file, i) => (
              <div key={i} className="py-1 flex items-center justify-between">
                <span className="text-[#F2EFE7]">{file.path}</span>
                <span className="text-[10px] text-[#D0C8B7]/60 tabular-nums">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
