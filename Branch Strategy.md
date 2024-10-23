# Git
 
## Branch Strategy 
* **Main branch**: (Production), all developers must approve the pull request to merge the changes to main branch
* **Test branch**: before merging to main on this branch the product must be tested thoroughly.
* **Dev branch**: at least one developer must approve the pull request to merge the changes to main branch.
* **Feature branch**: any developer can create a feature branch from the dev branch.
	* Naming convention - feature_[feature-name]
	* Example - fix_reservation_tier3
* **Bug branch**: use this branch to fix bugs, anyone can create this branch from from any other branch.
	* Naming convention - Bug_[short-bug-description]
	* Example - Bug_login-not-working

> Use all lowercase characters
>  Use "-" for space
> First letter of the branch type must be uppercase 
> Use the character "_" for space between branch type and branch name
> Avoid long and descriptive names 

## Branch Order
Feature -> Dev -> Main

Feature -> Bug -> Feature

Dev, Test, Main -> Bug -> Test

## Commit message strategy 
> Always use git cli
> Use Commitlint
> Avoid big commits such as where you commit a whole feature, rather instead brake the feature down to smaller more understandable pieces and make commits out of them.
> Use all lowercase text

Commit types:
-   build
-   chore
-   ci
-   docs
-   feat
-   fix
-   perf
-   refactor
-   revert
-   style
-   test

Commit convention:
```
[type]:[action] [message]
// Examples
style: add image
docs: add readme.md
refactor: remove empty space
test: add unit tests for ...
```
