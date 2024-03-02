from flask import Flask, request, jsonify
from git import Repo
import tempfile
import shutil
import os
import logging
from flask_cors import CORS

logging.basicConfig(
    level=logging.DEBUG, format="%(asctime)s - %(levelname)s - %(message)s"
)


app = Flask(__name__)
CORS(app)


@app.route("/generate-diff", methods=["POST"])
def generate_diff():
    data = request.json
    repo_path = data.get("repo_path")

    if not repo_path:
        logging.error("repo_path is required but was not provided.")
        return jsonify({"error": "repo_path is required"}), 400

    logging.info(f"Received repo_path: {repo_path}")

    if not os.path.exists(repo_path):
        logging.error(f"Repository path does not exist: {repo_path}")
        return jsonify({"error": "Repository path does not exist"}), 404

    try:
        repo = Repo(repo_path)
        logging.info(f"Initialized Repo object for path: {repo_path}")

        diff = repo.git.diff("HEAD~1", "HEAD")
        logging.debug(f"Generated diff for repo at {repo_path}")

        diff_file_path = "diff_output.txt"
        with open(diff_file_path, "w") as file:
            file.write(diff)
        logging.info(f"Diff file generated at {diff_file_path}")

        # Success response
        return jsonify({"message": f"Diff file generated at {diff_file_path}"}), 200
    except Exception as e:
        logging.error(f"Error generating diff for repo at {repo_path}: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/generate-diff-from-url", methods=["POST"])
def generate_diff_from_url():
    data = request.json
    git_url = data.get("git_url")
    branch_name = data.get("branch_name", "master")
    compare_branch = data.get("compare_branch", "main")

    if not git_url:
        return jsonify({"error": "git_url is required"}), 400

    try:
        temp_dir = tempfile.mkdtemp()
        logging.info(f"Cloning {git_url} into temporary bare repository at {temp_dir}")

        repo = Repo.clone_from(git_url, temp_dir, bare=True)

        logging.info("Fetching all branches")
        repo.git.fetch("--all")

        logging.info(f"Generating diff between {compare_branch} and {branch_name}")
        #         # diff = repo.git.diff(f'origin/{compare_branch}',
        #                      f'origin/{branch_name}')
        diff = repo.git.diff(f"{compare_branch}..{branch_name}")

        diff_file_path = "diff_output.txt"
        with open(diff_file_path, "w") as diff_file:
            diff_file.write(diff)

        logging.info(f"Diff file generated at {diff_file_path}")

        shutil.rmtree(temp_dir)

        return jsonify(
            {"message": f"Diff file generated at {diff_file_path}", "diff": diff}
        ), 200
    except Exception as e:
        logging.error(f"Failed to generate diff: {e}")
        if "temp_dir" in locals():
            shutil.rmtree(temp_dir)
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
