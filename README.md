## Learnings.  

1. Trpc=> in Regular nextjs server components sends data in any type to the client on a request to get rid of this we do use trpc.
2. cn=> Combining multiple classes they may contain the similar fields with different values.. 
3. Issue=>Multiple times uploading same file on select and upload..
4.PineCone=>(vector Database)=>uses a technique called sementic search
    ->Sementic Search is when not searching using the exact keywords but understanding the intent of query & using the context of query.{e.g. "Calories in Apple","Founder of Apple}
    ->for Semenic Search Embedding is used
    ->Embedding is a technique to represent words in a vector space where similar words are closer to each other. 
    ->Its like give you the best result for the query you have searched for based on combination of words.
    e.g.
        Small     Medium     Large
-----------------------------------
Brown  |        |    A    |      
-----------------------------------
Black  |    B   |         |   E
-----------------------------------
White  |        |         |   C
-----------------------------------

In this representation:
Image A: Brown color, Medium size
Image B: Black color, Small size
Image C: White color, Large size
Image E: Black color, Large size