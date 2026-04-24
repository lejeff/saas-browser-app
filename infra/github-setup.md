# GitHub Setup Commands

Run these after creating your GitHub repository and authenticating `gh`.

```bash
gh repo create financial-planner --private --source . --remote origin --push
gh api --method PUT repos/:owner/:repo/branches/main/protection \
  -f required_pull_request_reviews.dismiss_stale_reviews=true \
  -f required_pull_request_reviews.required_approving_review_count=1 \
  -f enforce_admins=true \
  -f required_linear_history=true \
  -f restrictions=
gh api --method PUT repos/:owner/:repo/environments/preview
gh api --method PUT repos/:owner/:repo/environments/production
```
