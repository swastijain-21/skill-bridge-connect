-- Expand the existing assessment records without changing their schema or access policies.
UPDATE public.skill_assessments
SET duration_minutes = 20,
    questions = '[
      {"q":"Which Python value is immutable?","options":["list","dict","tuple","set"],"answer":2,"difficulty":"Easy","topic":"Data types"},
      {"q":"What does len([1,2,3]) return?","options":["2","3","4","Error"],"answer":1,"difficulty":"Easy","topic":"Collections"},
      {"q":"Which keyword defines a function?","options":["func","define","def","function"],"answer":2,"difficulty":"Easy","topic":"Functions"},
      {"q":"What is 7 // 2?","options":["3.5","3","4","2"],"answer":1,"difficulty":"Easy","topic":"Operators"},
      {"q":"Which library provides DataFrame?","options":["numpy","pandas","flask","pytest"],"answer":1,"difficulty":"Easy","topic":"Modules"},
      {"q":"What does a list comprehension create?","options":["A class","A list","A generator only","A module"],"answer":1,"difficulty":"Medium","topic":"Control flow"},
      {"q":"Which block handles an exception?","options":["catch","try/except"," rescue","handle"],"answer":1,"difficulty":"Medium","topic":"Exceptions"},
      {"q":"What does open(path, ''r'') do?","options":["Deletes a file","Reads a file","Renames a file","Creates a directory"],"answer":1,"difficulty":"Medium","topic":"File handling"},
      {"q":"What does yield turn a function into?","options":["A decorator","A generator","A class","A package"],"answer":1,"difficulty":"Hard","topic":"Iterators"},
      {"q":"A decorator primarily changes what?","options":["A function or class behavior","The Python VM","A database schema","A file encoding"],"answer":0,"difficulty":"Hard","topic":"Decorators"},
      {"q":"Which method initializes an instance?","options":["__new__","__init__","__start__","constructor"],"answer":1,"difficulty":"Hard","topic":"OOP"},
      {"q":"What does `*args` collect?","options":["Keyword arguments","Positional arguments","Imports","Exceptions"],"answer":1,"difficulty":"Hard","topic":"Functions"},
      {"q":"Which statement skips to the next loop iteration?","options":["pass","continue","skip","next"],"answer":1,"difficulty":"Medium","topic":"Control flow"},
      {"q":"What is the usual purpose of a virtual environment?","options":["Isolate dependencies","Speed up loops","Encrypt code","Compile C"],"answer":0,"difficulty":"Medium","topic":"Modules"},
      {"q":"Why use `with open(...)`?","options":["Automatic resource cleanup","Faster parsing","Type conversion","Sorting"],"answer":0,"difficulty":"Hard","topic":"File handling"}
    ]'::jsonb
WHERE id = '50000000-0000-0000-0000-000000000001';

UPDATE public.skill_assessments
SET duration_minutes = 20,
    questions = '[
      {"q":"Which clause filters grouped rows?","options":["WHERE","HAVING","ORDER BY","LIMIT"],"answer":1,"difficulty":"Easy","topic":"Aggregation"},
      {"q":"Which join returns only matching rows?","options":["LEFT JOIN","FULL JOIN","INNER JOIN","CROSS JOIN"],"answer":2,"difficulty":"Easy","topic":"Joins"},
      {"q":"Which function counts rows?","options":["SUM()","COUNT()","AVG()","TOTAL()"],"answer":1,"difficulty":"Easy","topic":"Aggregation"},
      {"q":"Which keyword removes duplicates?","options":["UNIQUE","DISTINCT","SEPARATE","ONLY"],"answer":1,"difficulty":"Easy","topic":"Filtering"},
      {"q":"A primary key is what?","options":["Nullable","Duplicated","Unique and not null","Text only"],"answer":2,"difficulty":"Easy","topic":"Constraints"},
      {"q":"What does a LEFT JOIN preserve?","options":["Only right rows","All left rows","Only matches","No rows"],"answer":1,"difficulty":"Medium","topic":"Joins"},
      {"q":"What does GROUP BY produce?","options":["Groups for aggregates","Indexes","Views","Transactions"],"answer":0,"difficulty":"Medium","topic":"Aggregation"},
      {"q":"Which index is commonly useful for equality lookups?","options":["B-tree","Bitmap only","Heap","CSV"],"answer":0,"difficulty":"Medium","topic":"Indexes"},
      {"q":"What does a transaction ensure with COMMIT?","options":["Changes are persisted","Rows are sorted","Tables are renamed","Queries are cached"],"answer":0,"difficulty":"Medium","topic":"Transactions"},
      {"q":"Which normal form removes transitive dependencies?","options":["1NF","2NF","3NF","0NF"],"answer":2,"difficulty":"Hard","topic":"Data modelling"},
      {"q":"What is a correlated subquery dependent on?","options":["Outer query row","Only an index","A trigger","A view name"],"answer":0,"difficulty":"Hard","topic":"Subqueries"},
      {"q":"What does window function PARTITION BY do?","options":["Splits rows into analytic groups","Deletes groups","Creates tables","Commits data"],"answer":0,"difficulty":"Hard","topic":"Window functions"},
      {"q":"Which isolation issue allows dirty reads?","options":["Read uncommitted","Serializable","Repeatable read","Snapshot"],"answer":0,"difficulty":"Hard","topic":"Transactions"},
      {"q":"What does EXPLAIN primarily show?","options":["Query plan","Table data","User roles","Backups"],"answer":0,"difficulty":"Medium","topic":"Performance"},
      {"q":"A foreign key primarily enforces what?","options":["Referential integrity","Sorting","Encryption","Aggregation"],"answer":0,"difficulty":"Easy","topic":"Constraints"}
    ]'::jsonb
WHERE id = '50000000-0000-0000-0000-000000000002';

UPDATE public.skill_assessments
SET duration_minutes = 20,
    questions = '[
      {"q":"Which measure is resistant to outliers?","options":["Mean","Median","Range","Variance"],"answer":1,"difficulty":"Easy","topic":"Descriptive statistics"},
      {"q":"Which chart shows a numeric distribution?","options":["Pie","Histogram","Map","Table only"],"answer":1,"difficulty":"Easy","topic":"Visualization"},
      {"q":"Correlation of zero means what?","options":["No linear relationship","Causation","Perfect fit","Equal means"],"answer":0,"difficulty":"Easy","topic":"Relationships"},
      {"q":"Which step removes duplicate records?","options":["Deduplication","Encoding","Scaling","Aggregation"],"answer":0,"difficulty":"Easy","topic":"Data cleaning"},
      {"q":"A categorical variable represents what?","options":["Labels or groups","Only decimals","A timestamp only","A formula"],"answer":0,"difficulty":"Easy","topic":"Data types"},
      {"q":"Why standardize numeric features?","options":["Put scales on a comparable basis","Remove all rows","Create labels","Sort text"],"answer":0,"difficulty":"Medium","topic":"Feature preparation"},
      {"q":"What does a confidence interval estimate?","options":["A plausible parameter range","A chart color","A row count only","A database key"],"answer":0,"difficulty":"Medium","topic":"Inference"},
      {"q":"Which plot is useful for two numeric variables?","options":["Scatter plot","Pie chart","Treemap only","Gauge"],"answer":0,"difficulty":"Medium","topic":"Visualization"},
      {"q":"What is missing-value imputation?","options":["Filling missing values using a rule","Deleting every column","Sorting values","Joining tables"],"answer":0,"difficulty":"Medium","topic":"Data cleaning"},
      {"q":"What does a p-value quantify?","options":["Evidence against a null hypothesis","Model size","Missingness count","Chart width"],"answer":0,"difficulty":"Hard","topic":"Inference"},
      {"q":"What is data leakage?","options":["Using future/target information during training","Losing a file","Duplicating rows","Changing units"],"answer":0,"difficulty":"Hard","topic":"Modelling"},
      {"q":"Why use a train/test split?","options":["Estimate generalization","Increase labels","Remove outliers only","Normalize dates"],"answer":0,"difficulty":"Hard","topic":"Modelling"},
      {"q":"What does skewness describe?","options":["Asymmetry of a distribution","Sample size","Correlation sign only","A missing value"],"answer":0,"difficulty":"Hard","topic":"Descriptive statistics"},
      {"q":"A box plot commonly displays what?","options":["Quartiles and outliers","Only categories","SQL joins","Text length"],"answer":0,"difficulty":"Medium","topic":"Visualization"},
      {"q":"What is an aggregation?","options":["Combining rows into summaries","Encrypting values","Renaming columns","Parsing HTML"],"answer":0,"difficulty":"Easy","topic":"Data preparation"}
    ]'::jsonb
WHERE id = '50000000-0000-0000-0000-000000000003';

UPDATE public.skill_assessments
SET duration_minutes = 20,
    questions = '[
      {"q":"DAX is primarily used for what?","options":["Calculations","CSS styling","Networking","Testing"],"answer":0,"difficulty":"Easy","topic":"DAX"},
      {"q":"Which view defines relationships?","options":["Report","Model","Data","Query"],"answer":1,"difficulty":"Easy","topic":"Data modelling"},
      {"q":"Power Query is mainly for what?","options":["Data transformation","Publishing","Security","Printing"],"answer":0,"difficulty":"Easy","topic":"Power Query"},
      {"q":"A measure is evaluated when?","options":["At query time","Only at import","Only in row context","Never"],"answer":0,"difficulty":"Easy","topic":"DAX"},
      {"q":"Which visual shows part-to-whole?","options":["Scatter","Donut","Gauge","Funnel"],"answer":1,"difficulty":"Easy","topic":"Visualization"},
      {"q":"What is a star schema centered on?","options":["A fact table and dimensions","Only one table","A CSS grid","A file system"],"answer":0,"difficulty":"Medium","topic":"Data modelling"},
      {"q":"What does a slicer do?","options":["Filters report visuals","Edits SQL","Creates users","Exports code"],"answer":0,"difficulty":"Medium","topic":"Interactivity"},
      {"q":"What is query folding?","options":["Pushing transformations to the source","Compressing images","Hiding a report","Sorting measures"],"answer":0,"difficulty":"Medium","topic":"Power Query"},
      {"q":"Why define a date table?","options":["Consistent time intelligence","Faster passwords","Image rendering","Row deletion"],"answer":0,"difficulty":"Medium","topic":"Time analysis"},
      {"q":"What does CALCULATE modify?","options":["Filter context","File format","User password","Visual size"],"answer":0,"difficulty":"Hard","topic":"DAX"},
      {"q":"What is row-level security used for?","options":["Restricting data by viewer","Formatting titles","Adding charts","Cleaning text"],"answer":0,"difficulty":"Hard","topic":"Security"},
      {"q":"A many-to-many relationship can cause what?","options":["Ambiguous filtering","Automatic backups","Faster imports always","No relationships"],"answer":0,"difficulty":"Hard","topic":"Data modelling"},
      {"q":"What does an aggregation table improve?","options":["Query performance for summaries","Password strength","Chart colors","Source licensing"],"answer":0,"difficulty":"Hard","topic":"Performance"},
      {"q":"Which feature combines pages into a guided story?","options":["Bookmarks and buttons","Primary keys","Indexes","Triggers"],"answer":0,"difficulty":"Medium","topic":"Report design"},
      {"q":"What does a KPI commonly compare?","options":["Actual versus target","Two passwords","Rows versus columns only","Files versus folders"],"answer":0,"difficulty":"Easy","topic":"Visualization"}
    ]'::jsonb
WHERE id = '50000000-0000-0000-0000-000000000004';

UPDATE public.skill_assessments
SET duration_minutes = 20,
    questions = '[
      {"q":"Which declaration is block scoped?","options":["var","let","function","global"],"answer":1,"difficulty":"Easy","topic":"Variables"},
      {"q":"typeof null returns what?","options":["null","object","undefined","number"],"answer":1,"difficulty":"Easy","topic":"Types"},
      {"q":"Which Promise method handles fulfillment?","options":["then","catch","finally","await only"],"answer":0,"difficulty":"Easy","topic":"Asynchronous code"},
      {"q":"Which array method returns a new transformed array?","options":["push","map","splice","pop"],"answer":1,"difficulty":"Easy","topic":"Arrays"},
      {"q":"What does === compare?","options":["Value only","Type only","Value and type","References only"],"answer":2,"difficulty":"Easy","topic":"Operators"},
      {"q":"What is a closure?","options":["Function with access to its lexical scope","A closed browser tab","A class only","A loop"],"answer":0,"difficulty":"Medium","topic":"Functions"},
      {"q":"What does async function return?","options":["A Promise","A string always","An iterator only","Nothing"],"answer":0,"difficulty":"Medium","topic":"Asynchronous code"},
      {"q":"Which operation is immutable for an array?","options":["concat","sort","reverse","splice"],"answer":0,"difficulty":"Medium","topic":"Arrays"},
      {"q":"What does destructuring do?","options":["Extracts values from structures","Deletes objects","Compiles CSS","Catches errors"],"answer":0,"difficulty":"Medium","topic":"Syntax"},
      {"q":"What is event delegation based on?","options":["Bubbling events to a common ancestor","Polling every element","A database trigger","CSS inheritance"],"answer":0,"difficulty":"Hard","topic":"DOM events"},
      {"q":"What does the event loop coordinate?","options":["Call stack and task queues","CSS and HTML files","Database tables","Only timers"],"answer":0,"difficulty":"Hard","topic":"Runtime"},
      {"q":"What is the temporal dead zone associated with?","options":["let and const before initialization","var after use","Functions after return","JSON parsing"],"answer":0,"difficulty":"Hard","topic":"Variables"},
      {"q":"What does Promise.all do on one rejection?","options":["Rejects the combined Promise","Ignores it","Retries automatically","Returns only the error string"],"answer":0,"difficulty":"Hard","topic":"Asynchronous code"},
      {"q":"Which syntax creates a shallow copy of an object?","options":["{...object}","object.copyDeep()","copy object","Object.cloneDeep"],"answer":0,"difficulty":"Medium","topic":"Objects"},
      {"q":"What does optional chaining prevent?","options":["Errors when accessing through nullish values","All syntax errors","Network failures","Type coercion"],"answer":0,"difficulty":"Easy","topic":"Operators"}
    ]'::jsonb
WHERE id = '50000000-0000-0000-0000-000000000005';

UPDATE public.skill_assessments
SET duration_minutes = 20,
    questions = '[
      {"q":"What is the best first step before a client update?","options":["Improvise","Prepare an agenda","Send slides after","Skip notes"],"answer":1,"difficulty":"Easy","topic":"Preparation"},
      {"q":"A good status update is what?","options":["Long and vague","Concise and specific","Only verbal","Unstructured"],"answer":1,"difficulty":"Easy","topic":"Written communication"},
      {"q":"When you miss a deadline, you should what?","options":["Stay silent","Flag it early with a plan","Blame others","Wait to be asked"],"answer":1,"difficulty":"Easy","topic":"Accountability"},
      {"q":"Active listening includes what?","options":["Interrupting","Paraphrasing to confirm","Multitasking","Taking over"],"answer":1,"difficulty":"Easy","topic":"Listening"},
      {"q":"Technical writing should prioritize what?","options":["Jargon","Clarity","Length","Humor"],"answer":1,"difficulty":"Easy","topic":"Technical writing"},
      {"q":"What is the best way to resolve an ambiguous request?","options":["Guess silently","Ask a focused clarifying question","Ignore it","Delegate without context"],"answer":1,"difficulty":"Medium","topic":"Clarification"},
      {"q":"Constructive feedback should focus on what?","options":["Observable behavior and impact","Personality","Rumors","Past unrelated errors"],"answer":0,"difficulty":"Medium","topic":"Feedback"},
      {"q":"What should an escalation include?","options":["Problem, impact, and proposed next step","Only blame","No evidence","A vague complaint"],"answer":0,"difficulty":"Medium","topic":"Escalation"},
      {"q":"Which tone is best for a disagreement?","options":["Respectful and evidence-based","Sarcastic","Aggressive","Dismissive"],"answer":0,"difficulty":"Medium","topic":"Conflict"},
      {"q":"What is audience adaptation?","options":["Adjusting message to audience needs","Using more jargon always","Removing all detail","Repeating one script"],"answer":0,"difficulty":"Hard","topic":"Audience"},
      {"q":"A persuasive proposal should connect evidence to what?","options":["A clear recommendation","Personal status","Unrelated history","More decoration"],"answer":0,"difficulty":"Hard","topic":"Persuasion"},
      {"q":"What is a communication channel risk?","options":["A medium may omit context or cues","Every channel is identical","Messages cannot be revised","Only meetings fail"],"answer":0,"difficulty":"Hard","topic":"Channels"},
      {"q":"How should sensitive feedback usually be delivered?","options":["Privately and specifically","Publicly and vaguely","Anonymously always","In a group chat"],"answer":0,"difficulty":"Hard","topic":"Feedback"},
      {"q":"What makes meeting notes actionable?","options":["Decisions, owners, and due dates","Only attendees","A long transcript","Decorative formatting"],"answer":0,"difficulty":"Medium","topic":"Meetings"},
      {"q":"What should a concise executive summary lead with?","options":["The key conclusion","Every background detail","Unresolved jargon","A personal anecdote"],"answer":0,"difficulty":"Easy","topic":"Summarization"}
    ]'::jsonb
WHERE id = '50000000-0000-0000-0000-000000000006';
