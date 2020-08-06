git co release
git reset --hard HEAD~1
git merge master
echo "base-command.whipple.life" > CNAME
git add CNAME
git commit -m "Update CNAME for release"
git push release release
git co master
