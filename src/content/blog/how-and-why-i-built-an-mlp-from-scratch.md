---
title: 'How and why I built a Neural Network from scratch.'
description: 'I talk about why and how I built a neural network, what i learned from it.'
pubDate: 'Jun 11 2024'
heroImage: '/nnfs.png'
---

### What I built

I built a MLP from scratch using only python, numpy and pandas. you can find the repository for it [here](https://github.com/gnaaruag/tiny.nn).

### Why i built it

I have always had a philosophy of jump into the ocean and then learn how to swim when it comes to learning new things. So as someone who knows very little about the math and the crux of ML i decided to dive headfirst and build a MLP from scratch. 
Good idea right? NO! Not a good idea.

### How an MLP works

Is it literally matrix multiplication? 
![Neural Network](https://imgur.com/TCDpg1I.png)

Not quite, so let me quickly go through every part of an MLP.

#### Perceptron

A perceptron is a simplest unit of a Neural Network. Takes in `N` inputs and gives an output. To get the output for each perceptron we perform the dot product of of the input matrix and the weights connecting each input to the perceptron.

`x.w = (x1 x w1) + (x2 x w2) + .... + (xn x wn)` 

More often than not a Perceptron requires a bias `b` so that we can nudge the MLP towards certain proclivities, so we add it to the dot product.

`z = x.w + b`

#### Activation Functions

We pass the output of a perceptrons through an activation function which adds a non-linearity to the output.
In my implementation I have used `Rectified Linear Unit Activation` and `Softmax Activation`.

#### Layers

Each layer consists of a group of neurons, also called nodes or units, and each neuron typically connects to all the neurons in the previous layer, forming a network of interconnected nodes. There are usually three kinds, an `Input layer`, an `Output layer` and `Hidden layers`.

Here is how i coded up a layer

```python
import numpy as np

class DenseLayer:

	def __init__(self, inputs, neuron_count):
		self.weights = 0.10 * np.random.randn(inputs, neuron_count)
		self.biases = np.zeros((1, neuron_count))

	def forward_prop(self, input):
		self.input = input
		self.output = np.dot(input, self.weights) + self.biases

	def backward(self, dvalues):
		self.dweights = np.dot(self.input.T, dvalues)
		self.dbiases = np.sum(dvalues, axis=0, keepdims=True)
		self.dinputs = np.dot(dvalues, self.weights.T)
```

#### Loss 

Loss is essentially figuring out how wrong the output is from the expected output. One of many ways to compute loss for an output is by comparing the one hot encoded vector for the label of a given sample with the actual output.

If we are dealing with a Classification problem we prefer using a `categorical cross entropy function`, whereas for a Regression problem we prefer a `mean squared error function`. 

* implementations of both loss functions can be found in the `/Loss` subdirectory of the repo

#### Backpropagation

Backpropping refers to the algorithm for computing the gradient of the loss function with respect to the weights.

Sounds confusing? 
In simple terms during backpropagation we need to find the optimal weights and biases for our every perceptron. To do that we need to know how the cost function changes in relation to weights and bias. This is done with the help of the gradients, i.e. How one quantity changes in relation to another quantity. In our case, we need to find how the cost function changes with respect to the weights and bias.

#### Optimization

Optimization is the selection of the best element from some set of available alternatives, which in our case, is the selection of best weights and bias of the perceptron. During optimization we just tune our weights and biases according to the results of the backpropagation operation.

#### Putting it all together.

I classified good ol MNIST numbers in this [notebook](https://github.com/gnaaruag/tiny.nn/blob/main/mnist_example.ipynb)

But here is the gist

We make all necessary imports.

```python
from Layers.DenseLayer import DenseLayer
from ActivationClasses.ReluActivation import ReluActivation
from ActivationClasses.SoftmaxActivation import Softmax
from Loss.CategoricalCrossEntropy import CategoricalCrossEntropy
from Optimizer.Adam import Optimizer_Adam
```

Load our dataset 

```python 
data = pd.read_csv("./Datasets/mnist.csv")
```

We then split the data into training and testing segments

Then define our network parameters and architecture as follows

```python
l1 = DenseLayer(784, 128)
act1 = ReluActivation()

l2 = DenseLayer(128, 64)
act2 = ReluActivation()

l3 = DenseLayer(64, 10)
act3 = Softmax()

loss = CategoricalCrossEntropy()
optimizer = Optimizer_Adam(learning_rate=0.001)
```

#### Train

We train our MLP for a certain number of epochs using the below code snippet.

```python
for epoch in range(epochs + 1):
    # forward prop
    l1.forward_prop(X_train)
    act1.forward(l1.output)

    l2.forward_prop(act1.output)
    act2.forward(l2.output)

    l3.forward_prop(act2.output)
    act3.forward(l3.output)

    # loss calc
    loss_fin = loss.calculate(act3.output, y_train)

    # back prop
    loss.backward(act3.output, y_train)
    act3.backward(loss.dinputs)
    l3.backward(act3.dinputs)
    act2.backward(l3.dinputs)
    l2.backward(act2.dinputs)
    act1.backward(l2.dinputs)
    l1.backward(act1.dinputs)

    # optimise

    optimizer.update_params(l1)
    optimizer.update_params(l2)
    optimizer.update_params(l3)
    predictions = np.argmax(act3.output, axis=1)
    accuracy = np.mean(predictions == y_train)
    print(f'Epoch: {epoch}, Loss: {loss_fin}, Accuracy: {accuracy}')

# result
predictions = np.argmax(act3.output, axis=1)
accuracy = np.mean(predictions == y_train)

print(f'Final accuracy: {accuracy}')
print(f'Final loss: {loss_fin}')
```

The results of training our MLP were as follows

```
Final accuracy: 0.9777666666666667
Final loss: 0.07874550094797444
```

#### Test

To test our MLP we go through the testing dataset and generate outputs and compare it to the label given for the data row.

We do it in the following code snippet.

```python
correct = 0
for i in range(len(X_test)):
    # Forward pass
    l1.forward_prop(X_test[i])
    act1.forward(l1.output)

    l2.forward_prop(act1.output)
    act2.forward(l2.output)

    l3.forward_prop(act2.output)
    act3.forward(l3.output)

    # Calculate loss and accuracy for each test sample

    prediction = np.argmax(act3.output)
    if prediction == y_test[i]:
        correct += 1

    # Print label and guess for each test sample
    print(f'Label: {y_test[i]}, Guess: {prediction}')

# Calculate overall accuracy and loss
accuracy = correct / len(X_test)
print(f'Test Accuracy: {accuracy}')
```

The results of testing were as follows.

```
Test Accuracy: 0.9691
```

The accuracy of the testing is pretty much on par what with we expect it to be.

#### Final Thoughts.

Over countless  tutorials and medium blogs I now have a pretty much basic understanding of how an MLP works. Doing this was quite an experience and I'd recommend this methodology of doing things. (PS do it at your own risk).
Now that I'm done with this implementation, was this the most optimal way to learn how to implement a neural network? No, Was it fun? Kind of. 