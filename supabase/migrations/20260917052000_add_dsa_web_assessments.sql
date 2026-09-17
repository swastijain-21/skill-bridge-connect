-- Add first-class DSA and Web Development assessments without duplicating
-- existing equivalent skills or assessment records.
DO $$
DECLARE
  dsa_skill_id uuid;
  web_skill_id uuid;
BEGIN
  SELECT id INTO dsa_skill_id
  FROM public.skills
  WHERE lower(name) IN ('dsa', 'data structures & algorithms', 'data structures and algorithms')
  ORDER BY CASE WHEN lower(name) = 'dsa' THEN 0 ELSE 1 END
  LIMIT 1;

  IF dsa_skill_id IS NULL THEN
    INSERT INTO public.skills (name, category, demand_score, description)
    VALUES ('DSA', 'technical', 90, 'Data structures and algorithmic problem solving')
    RETURNING id INTO dsa_skill_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.skill_assessments WHERE skill_id = dsa_skill_id) THEN
    INSERT INTO public.skill_assessments (skill_id, title, description, duration_minutes, questions)
    VALUES (
      dsa_skill_id,
      'DSA Assessment',
      'Data structures, algorithms, complexity, and problem solving.',
      20,
      '[
        {"q":"What is the typical time complexity of accessing an array element by index?","options":["O(1)","O(log n)","O(n)","O(n log n)"],"answer":0,"difficulty":"Easy","topic":"Arrays"},
        {"q":"Which data structure stores characters in sequence?","options":["String","Heap","Graph","Queue"],"answer":0,"difficulty":"Easy","topic":"Strings"},
        {"q":"What is the first node in a singly linked list commonly called?","options":["Root","Head","Top","Frontier"],"answer":1,"difficulty":"Easy","topic":"Linked Lists"},
        {"q":"Which structure follows last-in, first-out order?","options":["Queue","Stack","Heap","Graph"],"answer":1,"difficulty":"Easy","topic":"Stacks"},
        {"q":"Which structure follows first-in, first-out order?","options":["Stack","Queue","Tree","Set"],"answer":1,"difficulty":"Easy","topic":"Queues"},
        {"q":"What is the average lookup complexity of a well-distributed hash table?","options":["O(1)","O(log n)","O(n)","O(n²)"],"answer":0,"difficulty":"Medium","topic":"Hashing"},
        {"q":"What is the base case used for in recursion?","options":["To stop recursive calls","To sort values","To allocate a heap","To create a graph"],"answer":0,"difficulty":"Medium","topic":"Recursion"},
        {"q":"Which sorting algorithm has average O(n log n) complexity?","options":["Bubble sort","Selection sort","Merge sort","Linear scan"],"answer":2,"difficulty":"Medium","topic":"Sorting"},
        {"q":"Binary search requires the input to be what?","options":["Randomized","Sorted","Duplicated","A linked list"],"answer":1,"difficulty":"Medium","topic":"Searching"},
        {"q":"In a binary search tree, values in the left subtree are usually what?","options":["Greater than the node","Less than the node","Always equal","Unrelated"],"answer":1,"difficulty":"Medium","topic":"Trees"},
        {"q":"Which heap operation restores heap order after removing the root?","options":["Heapify","Hashing","Backtracking","Partitioning"],"answer":0,"difficulty":"Hard","topic":"Heaps"},
        {"q":"Which traversal finds shortest paths in an unweighted graph?","options":["Depth-first search","Breadth-first search","In-order traversal","Binary search"],"answer":1,"difficulty":"Hard","topic":"Graphs"},
        {"q":"What is the time complexity of visiting every vertex and edge once?","options":["O(1)","O(log V)","O(V + E)","O(V²E)"],"answer":2,"difficulty":"Hard","topic":"Time Complexity"},
        {"q":"What is the extra space used by an in-place iterative scan usually?","options":["O(1)","O(log n)","O(n)","O(n²)"],"answer":0,"difficulty":"Hard","topic":"Space Complexity"},
        {"q":"Dynamic programming is most useful when a problem has what?","options":["Overlapping subproblems and optimal substructure","Only unique inputs","No base case","Only sorted arrays"],"answer":0,"difficulty":"Hard","topic":"Dynamic Programming"}
      ]'::jsonb
    );
  END IF;

  SELECT id INTO web_skill_id
  FROM public.skills
  WHERE lower(name) IN ('web development', 'web dev', 'web-development')
  ORDER BY CASE WHEN lower(name) = 'web development' THEN 0 ELSE 1 END
  LIMIT 1;

  IF web_skill_id IS NULL THEN
    INSERT INTO public.skills (name, category, demand_score, description)
    VALUES ('Web Development', 'technical', 91, 'Frontend, backend, and web platform development')
    RETURNING id INTO web_skill_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.skill_assessments WHERE skill_id = web_skill_id) THEN
    INSERT INTO public.skill_assessments (skill_id, title, description, duration_minutes, questions)
    VALUES (
      web_skill_id,
      'Web Development Assessment',
      'HTML, CSS, JavaScript, web platforms, APIs, security, and deployment.',
      20,
      '[
        {"q":"Which HTML element represents the main heading?","options":["<h1>","<head>","<title>","<header>"],"answer":0,"difficulty":"Easy","topic":"HTML"},
        {"q":"Which CSS property changes text color?","options":["font-style","color","background","text-decoration"],"answer":1,"difficulty":"Easy","topic":"CSS"},
        {"q":"Which JavaScript keyword declares a block-scoped variable?","options":["var","let","define","scope"],"answer":1,"difficulty":"Easy","topic":"JavaScript"},
        {"q":"What does `document.querySelector()` return?","options":["The first matching element","All matching elements","A CSS file","A server response"],"answer":0,"difficulty":"Easy","topic":"DOM"},
        {"q":"Which unit is relative to the viewport width?","options":["px","em","vw","pt"],"answer":2,"difficulty":"Easy","topic":"Responsive Design"},
        {"q":"What does HTTPS add to HTTP?","options":["Encryption in transit","A database","A CSS framework","A faster CPU"],"answer":0,"difficulty":"Medium","topic":"HTTP/HTTPS"},
        {"q":"Which HTTP method is commonly used to retrieve a resource?","options":["GET","PATCH","DELETE","TRACE only"],"answer":0,"difficulty":"Medium","topic":"HTTP/HTTPS"},
        {"q":"What is a REST API endpoint?","options":["A network address for a resource or operation","A CSS selector","A database index","A browser extension"],"answer":0,"difficulty":"Medium","topic":"APIs"},
        {"q":"Which CSS layout system is designed for two-dimensional layouts?","options":["Float","CSS Grid","Inline text","Position static"],"answer":1,"difficulty":"Medium","topic":"Frontend concepts"},
        {"q":"Why should a backend validate client input?","options":["Clients cannot be trusted","It improves CSS","It removes authentication","It avoids all database use"],"answer":0,"difficulty":"Medium","topic":"Backend fundamentals"},
        {"q":"What does a relational database table store?","options":["Rows and columns","Only images","CSS rules","HTTP headers only"],"answer":0,"difficulty":"Hard","topic":"Databases"},
        {"q":"What is the purpose of a session or access token?","options":["Represent an authenticated user","Style a button","Compress HTML","Choose a viewport"],"answer":0,"difficulty":"Hard","topic":"Authentication"},
        {"q":"Which practice helps prevent XSS?","options":["Escape untrusted output","Disable HTTPS","Store passwords in plain text","Trust query strings"],"answer":0,"difficulty":"Hard","topic":"Web security"},
        {"q":"What is a production deployment?","options":["Releasing an application to its serving environment","Writing a local comment","Changing a browser zoom","Deleting source code"],"answer":0,"difficulty":"Hard","topic":"Deployment"},
        {"q":"Why use a responsive breakpoint?","options":["Adapt layout to viewport conditions","Authenticate an API","Create a database row","Encrypt a password"],"answer":0,"difficulty":"Hard","topic":"Responsive Design"}
      ]'::jsonb
    );
  END IF;
END $$;
