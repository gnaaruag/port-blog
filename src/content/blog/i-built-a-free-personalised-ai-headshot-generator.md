---
title: 'I built a Free and Open Source Personalised Headshot Generator'
description: 'This blog post describes what I did and the underlying technology it uses.'
pubDate: 'Nov 19 2024'
heroImage: '/foss.png'
---

<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">websites charging 30-60 dollars for a few AI generated headshots is diabolical <br><br>So here&#39;s a repo i made that&#39;ll let you do it for free <a href="https://t.co/G6UkHGqosW">https://t.co/G6UkHGqosW</a></p>&mdash; gaurang (@gnaaruag) <a href="https://twitter.com/gnaaruag/status/1857409114437231024?ref_src=twsrc%5Etfw">November 15, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>


Recently I put out this tweet where I gave people an alternative solution to paying egregious amounts of money for the "AI generated professional headshot". It did about 1.7k impressions. Since there was interest in this topic. I thought I'd do a blog post where I go into the mechanics of how the underlying tech works.

The idea came about when I saw someone's tweet (of course🙄) about how expensive AI headshots are, I thought to myself "You can do this for free, spare the cost of training your LoRA". So i came up with scripts that do just that. In this blogpost I don't really want to dwell on the project itself but the underlying technology and architecture itself.

I used Flux as my image model, and trained a LoRA on it. whatever does that mean?

### Image Models and how they work.

Like I said I used Flux. `Flux.1-dev` is a 12B Prompt-to-Image model and "offers state-of-the-art performance image generation with top of the line prompt following, visual quality, image detail and output diversity" as claimed by its creators which is made possible by the use of a hybrid architecture that utilizes transformer and diffusion techniques.

Here's an overview of some major components that are used in text prompting to image generation 
#### Transformers

Transformers are models that are great at NLP and modelling relationships between individual parts of text, this enables us to understand the meaning and context of what the prompt is about. Put more formally transformers are models based on the self-attention mechanism that can process sequential data and capture long-distance dependencies. They consist of an encoder and a decoder, implementing information transfer and processing through self-attention layers and feed-forward neural network layers.

#### Diffusion Models

Diffusion models are based on this 2015 paper called "Deep Unsupervised Learning using Nonequilibrium Thermodynamics", here we slowly destroy structure in data through an iterative forward diffusion process, we then learn on a reverse process that lets us restore said data. So more formally they are generative models whose core idea is to gradually add noise to data through a diffusion process and then learn to reverse this process to construct the desired data samples from the noise.

#### Diffusion Transformers

Image models like Flux work on a hybrid diffusion transformer architecture where transformers are used as the backbone network for a diffusion model. Instead of text like in a text transformer, in a diffusion transformer we tokenize images. So with the help of a transformer architecture we are able to use the attention and self-attention concepts in image denoising, leading to better generation because of a better global context modelling. 

#### Flux series of models

Now that we know the underlying concepts here's how they come together. Flux models utilize two key techniques, rotary positional embeddings and parallel attention layers. 

Rotary embeddings provide the model with a detailed understanding of spatial relationships within an image meanwhile parallel attention layers allow the model to process different parts of an image simultaneously. 

Flux incorporates some combinatorics of autoencoders, CLIP text encoders and other encoders to translate textual concepts into meaningful visual representation. We are now able to generate image embeddings from text via text and then generate images via decoding to an image format.

Now that we can generate images based on text prompts how do you insert yourself in the mix?

### LoRAs

Without getting into the math LoRAs are basically mini models you can attach to your larger model to influence your outputs put more formally, it is a technique designed to fine-tune large machine learning models efficiently without requiring extensive computational resources or retraining the entire model.

While training a LoRA we do not change the original weights of the model but inject small low rank layers at certain points 

This lets us adapt a general purpose model to some specific use case in this case say generating headshots of your face.

The fact that some websites charge 60 is ridiculous, screw overpaying for AI slop. Do it Yourself!

Here's some outputs I generated for Joe Rogan and Jose Mourinho.
<div style="display: flex; justify-content: center;">
<blockquote class="twitter-tweet"><p lang="en" dir="ltr">ok so tried on joe rogan and jose mourinho.<a href="https://t.co/G6UkHGqosW">https://t.co/G6UkHGqosW</a><br>dont pay 60 dollars for ai headshot slop, do it yourself <a href="https://t.co/B8nu6Inad2">https://t.co/B8nu6Inad2</a> <a href="https://t.co/FFAIGdL8hd">pic.twitter.com/FFAIGdL8hd</a></p>&mdash; gaurang (@gnaaruag) <a href="https://twitter.com/gnaaruag/status/1857445004555547070?ref_src=twsrc%5Etfw">November 15, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>

btw here's the repo if you wanna give it a shot :)

https://github.com/gnaaruag/foss-headshot-generator

