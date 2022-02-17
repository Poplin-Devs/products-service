# SDC

## What is it?
A complete system design for a ecommerce website product's microservice. Includes a server which interacts with the client's HTTP requests as well as the database through an ORM and TCP/UDP requests. Initially designed to replace the website's original backend architecture, SDC had to outperform the old API in terms of speed, performance, and stability while serving more than 50 million data entries.

## API Documentation

#### List Products
Retrieves the list of products with pagination.

**GET** /products

<table>
  <tr>
    <th>Parameter</th>
    <th>Type</th>
    <th>Description</th> 
  </tr>
  <tr>
    <td>page</td>
    <td>Integer</td>
    <td>Selects the page of results to return. Default 1.</td> 
  </tr>
  <tr>
    <td>count</td>
    <td>Integer</td>
    <td>Specifies how many results per page to return. Default 5.</td> 
  </tr>
</table>

#### Product Information
Returns all product level information for a specified product id.

**GET** /products/:product_id

<table>
  <tr>
    <th>Parameter</th>
    <th>Type</th>
    <th>Description</th> 
  </tr>
  <tr>
    <td>product_id</td>
    <td>integer</td>
    <td>Required ID of the Product requested.</td> 
  </tr>
</table>

#### Product Styles
Returns all the styles available for the requested product.

**GET** /products/:product_id/styles

<table>
  <tr>
    <th>Parameter</th>
    <th>Type</th>
    <th>Description</th> 
  </tr>
  <tr>
    <td>product_id</td>
    <td>integer</td>
    <td>Required ID of the Product requested.</td> 
</table>

#### Related Products
Returns the id's of products related to the product specified.

**GET** /products/:product_id/related

<table>
  <tr>
    <th>Parameter</th>
    <th>Type</th>
    <th>Description</th> 
  </tr>
  <tr>
    <td>product_id</td>
    <td>integer</td>
    <td>Required ID of the Product requested.</td> 
  </tr>
</table>

## Development Process

### Phase 1: Creating the database

The first step was to create the database given 6 different comma-separated files which contained all of the product information. These files contained over 50 million entries and my first task was to optimize how this information was stored in the database to improve query performance. I went with MongoDB because a document based database made sense for the task at hand. After importing all the files into the database, I decided to combine all of them into a single collection which would efficiently deliver all the information required in a single query, taking a huge load off the database which otherwise would have had to perform different matching queries to gather information from different collections and deliver them to the client in real time.

The following diagram depicts the pipeline aggregation process:
![Aggregation](https://live.staticflickr.com/65535/51887355578_f627a14d90_b.jpg)

### Phase 2: Designing the server and connecting it to the database

After created the database, the next step was building the server that connects the client to the products. The server design had to be lightweight and support hundreds to thousands of requests per second. I decided to use Node.js and Express for the server and query the database using Mongoose. Because of how the database was designed, each HTTP request translated into a single database query through TCP/UDP.

### Phase 3: Stress Testing the service locally

The microservice was tested locally at first, before deployment, to iron out any major problems. I used Artillery.io to load test at a local level and created a script that would replicate a user's interaction with the website. Dozens if not hundreds of tests were performed at different RPS, starting with 300 RPS and reaching 600 RPS when my machine's processing power bottlenecked the operation.

#### 300 RPS

![300RPS](https://live.staticflickr.com/65535/51888008405_38cf6d497c_b.jpg)

#### 450 RPS

![450RPS](https://live.staticflickr.com/65535/51888015960_5544b12e74_b.jpg)

#### 600 RPS

![600RPS](https://live.staticflickr.com/65535/51887441863_b72a1a131c_b.jpg)

### Phase 4: Cloud Stress Testing the service

After deploying the server and the database into an AWS EC2 T2.Micro instance, I used Loader.io to stress test it. I was struggling to break the 200 RPS which seemed extremely low and decided to go back and find possible server and query optimization. The server was as lightweight as it could be and I didn't find any changes that could have improved performance, however, the ORM queries could use some work. There were a couple of methods that were quintessential in the optimization process. 

The first one was .lean(), which makes Mongoose return regular objects instead of Mongoose documents (which have added functionality and therefore are much bigger in size). The second method was .select(). Even though I optimized the database to return everything I could ever need in a single query, not every request needed every piece of information, and I was filtering out the unnecessary information in the server, before sending it to the client. The better way to do it is to filter as part of your query, using .select(). The RPS drastically increased after these 2 changes, and for comparison, testing locally allowed 600+ RPS at low latencies compared to having errors and dropped requests before.



