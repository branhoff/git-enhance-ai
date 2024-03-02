from git import Repo

repo_path = "../second-opinion"

repo = Repo(repo_path)

# This gets the diff of the last commit in the repo
diff = repo.git.diff('HEAD~1', 'HEAD')

diff_file_path = 'diff_output.txt'
with open(diff_file_path, 'w') as file:
    file.write(diff)

print(f"Diff file generated at {diff_file_path}")
