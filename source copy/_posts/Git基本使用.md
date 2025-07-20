---
title: Git基本使用（Windows版）
tags: [Git]
categories: [计算机]
---
# Git基本使用（Windows版）

参考[Git教程 - 廖雪峰的官方网站](https://www.liaoxuefeng.com/wiki/896043488029600)

---

### 安装git

[git](https://git-scm.com/downloads/win)

##### 测试是否安装成功

- 方式一

win + r 打开控制台输入

```
git --version
```

- 方式二

右击==》显示更多选项==》git bash here

或快捷键（shift + f10）

---

### 配置Git

```
$ git config --global user.name "Your Name"
$ git config --global user.email "email@example.com"
```

注意`git config`命令的`--global`参数，用了这个参数，表示你这台机器上所有的Git仓库都会使用这个配置，当然也可以对某个仓库指定不同的用户名和Email地址。

---

### 创建版本库

##### 新建文件夹

```
$ mkdir learngit
$ cd learngit
$ pwd
/Users/michael/learngit
```

**注意：如果你使用Windows系统，为了避免遇到各种莫名其妙的问题，请确保目录名（包括父目录）不包含中文。**

> $ mkdir learngit 创建一个空目录 为learngit
>
> $ cd learngit 进入目录 
>
> $ pwd 显示当前目录的路径
>
> $ cd  返回上一级目录 
>
> cd d:cyfor\\\\ggg
>
> $ ls 列出当前文件夹的所有文件或文件夹(不包括隐藏的文件)
>
> $ ls -ah 列出当前文件夹的所有文件或文件夹(包括隐藏的文件)

##### 变为Git仓库（将当前目录变成git可以管理的仓库）

```
$ git init
```

**当前目录会多一个`.git`的目录**

> $ git init          	git仓库初始化，把这个目录变成Git可以管理的仓库

##### 小结

初始化一个Git仓库，使用git init命令。

添加文件到Git仓库，分两步：

1. 使用命令git add <file>，注意，可反复多次使用，添加多个文件；
2. 如果有多个文件夹可以用 git add . 命令
3. 使用命令git commit -m <message>，完成。

---

### 把文件添加到版本库

```
$ git add 文件名/目录名（文件夹名）
$ git commit -m "本次提交的说明"
```

> $ git add readme.txt
>
>  把文件添加到仓库
>
> $ git commit -m "wrote a readme file"
>
>  把文件提交到仓库 -m后面输入的是本次提交的说明
>
> $ git add . 	
>
> 当前目录所有元素都加入（文件和文件夹）



```
$ git add file1.txt

$ git add file2.txt file3.txt

$ git commit -m "add 3 files."
```

commit可以一次提交很多文件，所以你可以多次add不同的文件

##### 查看仓库当前的状态

```
$ git status
```

##### 查看具体修改的内容

```
$ git diff
```

---

### 时光穿梭

##### 显示所有日志提交

```
$ git log 显示从最近到最远的提交日志

$ git log --pretty=oneline 简朴显示
```

##### 版本回退

首先，Git必须知道当前版本是哪个版本，在Git中，用`HEAD`表示当前版本，也就是最新的提交`1094adb...`（注意我的提交ID和你的肯定不一样），上一个版本就是`HEAD^`，上上一个版本就是`HEAD^^`，当然往上100个版本写100个`^`比较容易数不过来，所以写成`HEAD~100`。

```
$ git reset --hard HEAD^
```

`--hard`参数有啥意义？`--hard`会回退到上个版本的已提交状态，而`--soft`会回退到上个版本的未提交状态，`--mixed`会回退到上个版本已添加但未提交的状态。现在，先放心使用`--hard`。

##### 版本恢复

**方式一：知道版本号恢复**

办法其实还是有的，只要上面的命令行窗口还没有被关掉，你就可以顺着往上找啊找啊，找到那个`append GPL`的`commit id`是`1094adb...`，于是就可以指定回到未来的某个版本：

```
$ git reset --hard 1094a
```

版本号没必要写全，前几位就可以了，Git会自动去找。当然也不能只写前一两位，因为Git可能会找到多个版本号，就无法确定是哪一个了。

**方式二：寻找版本号恢复**

```
$ git reflog
```

##### 小结

- `HEAD`指向的版本就是当前版本，因此，Git允许我们在版本的历史之间穿梭，使用命令`git reset --hard commit_id`。
- 穿梭前，用`git log`可以查看提交历史，以便确定要回退到哪个版本。
- 要重返未来，用`git reflog`查看命令历史，以便确定要回到未来的哪个版本。

---

### 工作区和暂存区

电脑中可以看到的`目录（文件夹）` == 工作区

版本库（工作区有一个隐藏目录`.git`，这个不算工作区，而是Git的版本库）

版本库有stage和master（分支）、head（头指针）组成

```
$ git status 是对工作区的情况
$ git add xxx 是将工作区的内容提交到stage中
$ git commit -m "xxx" 是将stage的内容提交到master分支中
```

##### 总结

- 每次修改完文件，就add 放入stage中，再commit到分支，因为commit只会提交stage中的文件

---

### 撤销修改

**情况一（未添加到stage中）：直接撤销**

```
$ git checkout -- readme.txt
```

**情况二（放入到stage中）：撤销到工作区再直接撤销**

用命令`git reset HEAD <file>`可以把暂存区的修改撤销掉（unstage），重新放回工作区

```
$ git reset HEAD readme.txt
```

##### 情况三（commit到分支中）：直接回退版本（前提是没有将本地版本库推送到远程）

##### 小结

场景1：当你改乱了工作区某个文件的内容，想直接丢弃工作区的修改时，用命令`git checkout -- file`。

场景2：当你不但改乱了工作区某个文件的内容，还添加到了暂存区时，想丢弃修改，分两步，第一步用命令`git reset HEAD <file>`，就回到了场景1，第二步按场景1操作。

场景3：已经提交了不合适的修改到版本库时，想要撤销本次提交，参考[版本回退](##### 版本恢复)一节，不过前提是没有推送到远程库。

---

### 删除文件

**流程：**

1. **先删除工作区的文件（命令或手动）**
2. **使用git rm <file>`和`git add<file>**

**删除工作区的文件**

```
$ rm test.txt
```

**删除版本库中的文件**

```
$ git rm test.txt
$ git commit -m "remove test.txt"
```

**删错文件，从版本库中恢复**

`git checkout`其实是用版本库里的版本替换工作区的版本，无论工作区是修改还是删除，都可以“一键还原”。

```
$ git checkout -- test.txt
```

 **注意**

**从来没有被添加到版本库就被删除的文件，是无法恢复的！**

**小结**

命令`git rm`用于删除一个文件。如果一个文件已经被提交到版本库，那么你永远不用担心误删，但是要小心，你只能恢复文件到最新版本，你会丢失**最近一次提交后你修改的内容**。

---

### 远程仓库

##### 添加远程仓库

**第1步**：创建SSH Key。在用户主目录下，看看有没有.ssh目录，如果有，再看看这个目录下有没有`id_rsa`和`id_rsa.pub`这两个文件，如果已经有了，可直接跳到下一步。如果没有，打开Shell（Windows下打开Git Bash），创建SSH Key：

```
$ ssh-keygen -t rsa -C "youremail@example.com"
```

你需要把邮件地址换成你自己的邮件地址，然后一路回车，使用默认值即可，由于这个Key也不是用于军事目的，所以也无需设置密码。

如果一切顺利的话，可以在用户主目录里找到`.ssh`目录，里面有`id_rsa`和`id_rsa.pub`两个文件，这两个就是SSH Key的秘钥对，`id_rsa`是私钥，不能泄露出去，`id_rsa.pub`是公钥，可以放心地告诉任何人。

**第2步**：登陆GitHub，点击右上角的头像，settings，SSH与GPG公钥

然后，点“Add SSH Key”，填上任意Title，在Key文本框里粘贴`id_rsa.pub`文件的内容

**第3步**：在主页右上角找到“Create a new repo”按钮，创建一个新的仓库

**第4步**：连接对应的仓库

```
$ git remote add origin git@github.com:michaelliao/learngit.git
```

添加后，远程库的名字就是`origin`，这是Git默认的叫法，也可以改成别的，但是`origin`这个名字一看就知道是远程库。

**第5步**：把本地库的所有内容推送到远程库上

```
$ git push -u origin master
```

把本地库的内容推送到远程，用`git push`命令，实际上是把当前分支`master`推送到远程。

由于远程库是空的，我们第一次推送`master`分支时，加上了`-u`参数，Git不但会把本地的`master`分支内容推送的远程新的`master`分支，还会把本地的`master`分支和远程的`master`分支关联起来，在以后的推送或者拉取时就可以简化命令。

从现在起，只要本地作了提交，就可以通过命令：

```plain
$ git push origin master
```

##### SSH警告

当你第一次使用Git的`clone`或者`push`命令连接GitHub时，会得到一个警告：

```plain
The authenticity of host 'github.com (xx.xx.xx.xx)' can't be established.
RSA key fingerprint is xx.xx.xx.xx.xx.
Are you sure you want to continue connecting (yes/no)?
```

这是因为Git使用SSH连接，而SSH连接在第一次验证GitHub服务器的Key时，需要你确认GitHub的Key的指纹信息是否真的来自GitHub的服务器，输入`yes`回车即可。

Git会输出一个警告，告诉你已经把GitHub的Key添加到本机的一个信任列表里了：

```plain
Warning: Permanently added 'github.com' (RSA) to the list of known hosts.
```

这个警告只会出现一次，后面的操作就不会有任何警告了。

如果你实在担心有人冒充GitHub服务器，输入`yes`前可以对照[GitHub的RSA Key的指纹信息](https://help.github.com/articles/what-are-github-s-ssh-key-fingerprints/)是否与SSH连接给出的一致。

##### 查看远程库信息

如果添加的时候地址写错了，或者就是想删除远程库，可以用`git remote rm <name>`命令。使用前，建议先用`git remote -v`查看远程库信息：

```
$ git remote -v
```

##### 删除远程库

根据名字删除，比如删除`origin`：

```plain
$ git remote rm origin
```

此处的“删除”其实是解除了本地和远程的绑定关系，并不是物理上删除了远程库。远程库本身并没有任何改动。要真正删除远程库，需要登录到GitHub，在后台页面找到删除按钮再删除。

##### 小结

要关联一个远程库，使用命令`git remote add origin git@server-name:path/repo-name.git`；

关联一个远程库时必须给远程库指定一个名字，`origin`是默认习惯命名；

关联后，使用命令`git push -u origin master`第一次推送`master`分支的所有内容；

此后，每次本地提交后，只要有必要，就可以使用命令`git push origin master`推送最新修改；

分布式版本系统的最大好处之一是在本地工作完全不需要考虑远程库的存在，也就是有没有联网都可以正常工作，而SVN在没有联网的时候是拒绝干活的！当有网络的时候，再把本地提交推送一下就完成了同步，真是太方便了！

---

### 从远程库克隆

git clone 目标地址.git

```plain
$ git clone git@github.com:michaelliao/gitskills.git
```

你也许还注意到，GitHub给出的地址不止一个，还可以用`https://github.com/michaelliao/gitskills.git`这样的地址。实际上，Git支持多种协议，默认的`git://`使用`ssh`，但也可以使用`https`等其他协议。

使用`https`除了速度慢以外，还有个最大的麻烦是每次推送都必须输入口令，但是在某些只开放`http`端口的公司内部就无法使用`ssh`协议而只能用`https`。

##### 小结

要克隆一个仓库，首先必须知道仓库的地址，然后使用`git clone`命令克隆。

Git支持多种协议，包括`https`，但`ssh`协议速度最快。

---

### 分支处理

##### **创建`dev`分支，然后切换到`dev`分支**

```plain
$ git checkout -b dev
Switched to a new branch 'dev'
```

`git checkout`命令加上`-b`参数表示创建并切换，相当于以下两条命令：

```plain
$ git branch dev
$ git checkout dev
Switched to branch 'dev'
```

##### **git branch`命令查看当前分支**

```plain
$ git branch
* dev
  master
```

`git branch`命令会列出所有分支，当前分支前面会标一个`*`号。

##### **切换分支**

`git checkout 分支名`

```
$ git checkout master
```

现在，我们把`dev`分支的工作成果合并到`master`分支上：

##### 合并分支

```plain
$ git merge dev
Updating d46f35e..b17d20e
Fast-forward
 readme.txt | 1 +
 1 file changed, 1 insertion(+)
```

`git merge`命令用于合并指定分支到当前分支。合并后，再查看`readme.txt`的内容，就可以看到，和`dev`分支的最新提交是完全一样的。

注意到上面的`Fast-forward`信息，Git告诉我们，这次合并是“快进模式”，也就是直接把`master`指向`dev`的当前提交，所以合并速度非常快。

当然，也不是每次合并都能`Fast-forward`，我们后面会讲其他方式的合并。

合并完成后，就可以放心地删除`dev`分支了：

##### 删除分支

```plain
$ git branch -d dev
Deleted branch dev (was b17d20e).
```

删除后，查看`branch`，就只剩下`master`分支了：

##### 查看分支

```plain
$ git branch
* master
```

##### 小结

Git鼓励大量使用分支：

查看分支：`git branch`

创建分支：`git branch <name>`

切换分支：`git checkout <name>`或者`git switch <name>`

创建+切换分支：`git checkout -b <name>`或者`git switch -c <name>`

合并某分支到当前分支：`git merge <name>`

删除分支：`git branch -d <name>`

---

### 冲突

分支修改的当行，commit后。主分支有修改当行，commit。会有冲突。

解决方案（修改再提交）

我们可以直接查看readme.txt的内容：

```plain
Git is a distributed version control system.
Git is free software distributed under the GPL.
Git has a mutable index called stage.
Git tracks changes of files.
<<<<<<< HEAD
Creating a new branch is quick & simple.
=======
Creating a new branch is quick AND simple.
>>>>>>> feature1
```

Git用`<<<<<<<`，`=======`，`>>>>>>>`标记出不同分支的内容，我们修改如下后保存：

```plain
Git is a distributed version control system.
Git is free software distributed under the GPL.
Git has a mutable index called stage.
Git tracks changes of files.
Creating a new branch is quick and simple.
```

### 其他

用带参数的`git log`也可以看到分支的合并情况：

```
$ git log --graph --pretty=oneline --abbrev-commit
```

**尝试拉取远程更改时允许合并不相关的提交历史：**

```
git pull origin master --allow-unrelated-histories
```



cd(Change directory)    改变文件夹

mkdir(Make directory)    新建文件夹

pwd(Print working directory)   显示当前目录

init(Initialization)    初始化

status    情况

commit    提交

stage	暂存区

添加某个文件时，该文件必须在当前目录下存在，用ls或者dir命令查看当前目录的文件，看看文件是否存在，或者是否写错了文件名

























$ git remote add origin git@github.com:michaelliao/learngit.git

请千万注意，把上面的michaelliao替换成你自己的GitHub账户名

添加后，远程库的名字就是origin，这是Git默认的叫法，也可以改成别的，但是origin这个名字一看就知道是远程库。



$ git push -u origin master

把本地库的内容推送到远程，用git push命令，实际上是把当前分支master推送到远程。

由于远程库是空的，我们第一次推送master分支时，加上了-u参数，Git不但会把本地的master分支内容推送的远程新的master分支，还会把本地的master分支和远程的master分支关联起来，在以后的推送或者拉取时就可以简化命令。

只要本地作了提交，就可以通过命令：

$ git push origin master







git remote rm <name>命令。使用前，建议先用git remote -v查看远程库信息：

$ git remote -v

根据名字删除，比如删除origin：

$ git remote rm origin

此处的“删除”其实是解除了本地和远程的绑定关系，并不是物理上删除了远程库。远程库本身并没有任何改动。要真正删除远程库，需要登录到GitHub，在后台页面找到删除按钮再删除。





要关联一个远程库，使用命令git remote add origin git@server-name:path/repo-name.git；

关联一个远程库时必须给远程库指定一个名字，origin是默认习惯命名；

关联后，使用命令git push -u origin master第一次推送master分支的所有内容；

此后，每次本地提交后，只要有必要，就可以使用命令git push origin master推送最新修改；