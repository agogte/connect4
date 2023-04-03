#!/bin/bash
echo "commit name?"
read commit_name

git add .
git commit -m $commit_name
git push -u origin master