---
title: 'I tried optimizing customer wait times in a restaurant'
description: 'Customer-maxxing using algos, lmao what a nerd right?'
pubDate: 'Sep 30 2024'
heroImage: '/rest.png'
---
<div style="display: flex; justify-content: center;">
  <blockquote class="twitter-tweet">
    <p lang="en" dir="ltr">
      went to a restaurant saw the waiting queue and thought to myself that i can probably optimise this with a greedy algo<br><br>am i cooked?!
    </p>
    &mdash; gaurang (@gnaaruag) <a href="https://twitter.com/gnaaruag/status/1837783210253500619?ref_src=twsrc%5Etfw">September 22, 2024</a>
  </blockquote> 
  <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
</div>


Made this tweet about a week ago, so I am going to follow through and actually try and optimize it.

#### Constraints

Before going to the algo part we will define constraints

- Lets say this restaurant has a capacity of 66 people, 
	- 6x 2 seaters
	- 5x 4 seaters
	- 3x 6 seaters
	- 2x 8 seaters
- Lets assume the waiting hall has a capacity to hold 60 people
- Lets assume we get about 100 parties per hour (lets also assume party sizes are random)
- Lets assume average time a party spends at their table is 45 minutes
- Lets also assume any incoming party is not willing to wait more than an hour in the waiting hall

so we have G = { g<sub>1</sub>, g<sub>2</sub>, . . , g<sub>n</sub>} representing customer groups where each g<sub>i</sub> = (s<sub>i</sub>, a<sub>i</sub>, d<sub>i</sub>) where s<sub>i</sub> is no of individuals in a party, a<sub>i</sub> is their arrival time and d<sub>i</sub> is their departure time.

We have three constant terms C<sub>max</sub> i.e. Capacity, W<sub>max</sub> i.e. waiting hall capacity, and M<sub>wait</sub> i.e. the Maximum time a party is willing to wait which we have assumed to be 1 hour.

We also have T = { t<sub>1</sub>, t<sub>2</sub>, . . , t<sub>n</sub>} representing tables in the restaurant where each t<sub>i</sub> = (c<sub>i</sub>) i.e. capacity of said table

Finally we have W = Waiting queue represented as { w<sub>1</sub>, w<sub>2</sub>, . . , w<sub>n</sub>} where each w<sub>i</sub> = (s<sub>i</sub>, a<sub>i</sub>)

#### Best-Fit Assignment 

Now that we have all our constraints laid out lets pick an algorigthm to try to optimize this. The first thing that came to mind is greedy. So I looked around and tried mapping this with an algo, and the easiest way forward seemed like `Best Fit Assignment`

Best Fit Assignment is a greedy algorithm where we try to minimize wasted capacity when assigning items. We first sort items, find our best fit, assign to resource, repeat til end of input.

The algorithm looks like the following

```python
function generate_parties(num_parties):
	# of size num_parties
	party_size = [an array of random numbers varying from 1 to 8] 
	# simulates 10 hours worth of arrival in 10 mins 
	# doesnt admit anyone in the last hour 
	arrival_times = [an array of random numbers varying from 1 to 540]
	# we calculate this pre-emptively to reduce some computational complexity
	# we assume they sit in the restaurant between 30 to 90 minutes`
	departure_times = [an array of numbers formulized y `arrival[i] + random (30,90)`]

	return [(party_size[i], arrival_times[i], departure_times[i]) for i in range num_parties].sorted(key = arrival_times) 

function best_fit(curr_party_size, available_tables):
	available = { dict with table size and count of remaining of those variant}
	waiting_queue = deque()

	for gi in G:
		check if such table T is available such that g_i.s_i <= T.c_i:
			assign table such that T.ci is minimal
			served += 1
		else:
			assign g_i to waiting_queue
		
		for every g_i in waiting_queue:
			compute wait_time
			if wait_time > m_wait:
				pop from waiting_queue
				no_served += 1
			else:
				best_fit = try assign_table
				if best_fit:
					assign table such that T.ci is minimal
					served += 1
				else:
					update waiting
	
	return served, no_served, waiting_time 
```

I used this algo and simulated a restaurant expecting 100-200 parties for an equivalent 100 days and these are metrics worth interest.

- Average parties served per day = 128.32
- Average parties that left without service = 38.16
- Average wait time per party = 13.27 min

