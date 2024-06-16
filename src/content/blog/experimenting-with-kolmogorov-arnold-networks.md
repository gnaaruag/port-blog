---
title: 'Experimenting with Kolmogorov-Arnold Networks'
description: 'A post detailing what KANs are and about the classifiers i wrote in it.'
pubDate: 'Jun 16 2024'
heroImage: '/kan.png'
---

> We got machine learning 2.0 before GTA 6!!!

Posts like these have been popping up on my feed for the past few weeks; and obviously that got me intrigued. After a little digging, the buzz was about KANs or Kolmogorov Arnold Networks.

 The main premise of KANs in the words of the authors of the paper are 
 
 > While MLPs have fixed activation functions on nodes (neurons), KANs have learnable activation functions on edges (weights).

The whole thing has its roots in the `Kolmogorov-Arnold Representation Theorem` which says 

> If `f` is a multivariate continuous function on a bounded domain, then it can be written as a finite composition of continuous functions of a single variable and the binary operation of addition.

So what it means is a continuous functions (no sharp corners) can be represented as a combination or superposition of finite functions, in a way the addition function is the only multivariate function.

### A brief note on what they actually mean

KANs like MLPs are also universal approximators. Below I have taken snippets of what I thought was important the base papers explanation.

KANs are proposed as a promising alternative to MLPs. While MLPs have fixed activation functions on neurons, KANs have learnable activation functions on weights.

Every weight parameter is replaced by a univariate function parametrized as a spline. This seemingly simple change makes KANs outperform MLPs in terms of accuracy and interpretability, on small-scale AI + Science tasks.

KANs have no linear weight matrices at all: instead, each weight parameter is replaced by a learnable 1D function parametrized as a spline. KANs nodes simply sum incoming signals without applying any non-linearities.

### What I did with this

Now to be frank I do not understand this beyond a fundamental level but I just HAD to do something with it.

So I built a classifier with the help of the python package the authors provided along with the paper.

And you know i just had to complicate this because of course I had to, so instead of classifying something simple like mnist numbers I picked a pancreatic cancer dataset.

So i picked a pancreatic cancer dataset from kaggle. Did a little mode imputing, and used Column Transformation.

I then picked what i understand to be 7 features of importance from the dataset them being, `age`, `sex`, `plasma_ca19_9`, `creatinine`, `LYVE1`, `REG1B`, `TFF1`.

Then created a Train - Test - Validate split. After it converted the numpy arrays to a torch tensor.

I chose to define the model with following specifications

```python
model = KAN(width=[7,32,64,2], grid=10, k=3)
```

I used the Limited BFGS optimization, also used a Cross Entropy function, both of which are provided in the `pykan` package (just followed what the authors did in the docs)

I then ran the model for 50 epochs

It ran for about 45 mins and yielded the following results

```java
Train ACC: 0.8184019370460048 
Val ACC: 0.7727272727272727 
Test ACC: 0.7865168539325843
```

Really neat in my opinion.

Although I do have a few reservations because of the dataset nature but since it was just proof of concept experimentation for me I do not really care too much about that.

To conclude I had so much fun messing with this, trying to understand what on earth is going on. Since the paper holds a lot of promise like computational and parametrial (is that even a word?) efficiency it will be super exciting to see how things progress and what further research progresses.

##### Useful links
- [The base research paper](https://arxiv.org/abs/2404.19756)
- [The website with docs](https://kindxiaoming.github.io/pykan/)
- [Hello KAN](https://kindxiaoming.github.io/pykan/intro.html#get-started-with-kans)
- [Interesting YouTube video on this topic](https://www.youtube.com/watch?v=xLnQtLpPH-Y)