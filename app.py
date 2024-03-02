from flask import Flask, request, jsonify
from git import Repo
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
        # Initialize Repo object
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


if __name__ == "__main__":
    app.run(debug=True)
