### Deploying Dev

Dev version can be accessed at [https://dev.base-command.whipple.life]()

```
git push origin master
```

### Deploying Release (Prod)

Release version can be accessed at [https://base-command.whipple.life]()

1. `git co release`
2. `git reset --hard HEAD~1`
3. `git merge master`
4. Erase`dev.` from the beginning of the file "CNAME".
   Filename: CNAME   Contents:`base-command.whipple.life`
5. `git add CNAME`
6. `git commit -m "Update release CNAME"`
7. `git push release release`

### Itemization / ArcPlan

Everything goes by reactor tiers. Each level of reactor is another tier of game play.
This is to control difficulty arc, and required idle/play time.

Reactor power is assigned by clicking on synth. This will expire after 1 min, so can't let it idle long.
Furthermore, completing a level should grant 5x game play times power. You can play idle or play idle + levels to advance.
