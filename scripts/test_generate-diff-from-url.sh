curl -X POST http://localhost:5000/generate-diff-from-url \
-H "Content-Type: application/json" \
-d "{\"git_url\":\"git@github.com:second-opinion-ai/second-opinion.git\", \"branch_name\":\"issue-22-scrape-car-diagnostic-manuals\"}"
