# 🛠 Git & GitHub Command Reference | Mech Companion

This document summarizes the Git and GitHub commands used during the development and deployment of the **Mech Companion** project.

---

## 1. Initial Setup
Initialize a new local repository and connect it to GitHub.

```bash
# Initialize a new git repository
git init

# Connect local repo to GitHub (Replace URL with your repo)
git remote add origin https://github.com/TheHarshrajThakur/Minor-Project.git

# Verify the remote connection
git remote -v
```

---

## 2. Daily Workflow
The standard "Add, Commit, Push" cycle.

```bash
# Check current status (modified, staged, or untracked files)
git status

# Stage all changes for commit
git add .

# Record your changes with a descriptive message
git commit -m "Refined UI responsiveness and 3D performance"

# Push changes to the main branch on GitHub
git push origin main
```

---

## 3. Synchronizing with GitHub
How to handle updates from the remote repository.

```bash
# Download and merge changes from GitHub
git pull origin main

# Force pull when histories are unrelated (e.g., initial GitHub README conflict)
git pull origin main --allow-unrelated-histories
```

---

## 4. Resolving Conflicts
Used when local and remote changes overlap.

```bash
# Resolve all conflicts by favoring your local version
git checkout --ours .

# Resolve all conflicts by favoring the GitHub version
git checkout --theirs .

# After resolving, stage and commit the result
git add .
git commit -m "Resolved merge conflicts from remote"
```

---

## 5. Inspection & History
Reviewing the project timeline.

```bash
# View recent commit history
git log

# View a one-line summary of commits
git log --oneline

# View details of files in a specific branch/remote
git ls-tree -r origin/main
```

---

## 💡 Pro Tips for Mech Companion
- **Clean Commits**: Always try to commit specific features separately (e.g., "Fix: 3D model path" vs "Feature: Added Hand Tracking").
- **Branching**: Use branches for experimental features: `git checkout -b feature-vr-support`.
- **Force Pushing**: Use `git push origin main --force` only as a last resort, as it overwrites the history on GitHub.

---
*Generated for Mech Companion Development Session 2026.*
