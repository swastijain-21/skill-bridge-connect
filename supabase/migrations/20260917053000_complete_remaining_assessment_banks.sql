-- Complete only assessment banks that are missing or below the required 15 questions.
-- Existing complete banks and all assessment results remain unchanged.
DO $$
DECLARE
  skill_row record;
  assessment_id uuid;
  bank jsonb;
BEGIN
  FOR skill_row IN
    SELECT id, name FROM public.skills
    WHERE name IN (
      'Cloud Computing', 'Cybersecurity', 'Excel', 'Java', 'Machine Learning',
      'Node.js', 'Problem Solving', 'React', 'Teamwork', 'Communication',
      'Data Analysis'
    )
  LOOP
    SELECT id INTO assessment_id
    FROM public.skill_assessments
    WHERE skill_id = skill_row.id
    ORDER BY id
    LIMIT 1;

    bank := CASE skill_row.name
      WHEN 'Cloud Computing' THEN '[
        {"q":"What does cloud elasticity mean?","options":["Resources scale with demand","Data is always public","Servers never fail","Users write kernels"],"answer":0,"difficulty":"Easy","topic":"Cloud concepts"},
        {"q":"Which service model provides virtual machines?","options":["IaaS","PaaS","SaaS","DNS"],"answer":0,"difficulty":"Easy","topic":"Service models"},
        {"q":"What does an availability zone provide?","options":["An isolated location within a region","A programming language","A database row","A user password"],"answer":0,"difficulty":"Easy","topic":"Regions and zones"},
        {"q":"Which storage is commonly used for object files?","options":["Object storage","CPU cache","A queue","A subnet"],"answer":0,"difficulty":"Easy","topic":"Storage"},
        {"q":"What is a cloud region?","options":["A geographic area containing data centers","A firewall rule","A billing record","A container image"],"answer":0,"difficulty":"Easy","topic":"Regions and zones"},
        {"q":"What is the shared responsibility model about?","options":["Provider and customer security duties","Sharing passwords","Splitting invoices","Joining networks"],"answer":0,"difficulty":"Medium","topic":"Security"},
        {"q":"Why use autoscaling?","options":["Adjust capacity automatically","Encrypt every file","Replace monitoring","Remove backups"],"answer":0,"difficulty":"Medium","topic":"Scalability"},
        {"q":"What does a virtual private cloud isolate?","options":["A logical network environment","A source repository","A spreadsheet","A user interface"],"answer":0,"difficulty":"Medium","topic":"Networking"},
        {"q":"What is a container image?","options":["A packaged application and dependencies","A VM hardware profile","A DNS record","A log query"],"answer":0,"difficulty":"Medium","topic":"Containers"},
        {"q":"Why use a managed database service?","options":["The provider handles operational tasks","It removes schema design","It guarantees zero latency","It disables backups"],"answer":0,"difficulty":"Medium","topic":"Managed services"},
        {"q":"What does infrastructure as code enable?","options":["Versioned repeatable provisioning","Manual-only changes","Unencrypted storage","Random deployments"],"answer":0,"difficulty":"Hard","topic":"Infrastructure as code"},
        {"q":"Which design reduces dependence on one failure domain?","options":["Multi-zone deployment","One large VM","Manual uploads","Shared passwords"],"answer":0,"difficulty":"Hard","topic":"Reliability"},
        {"q":"What is a blue-green deployment?","options":["Two environments used for controlled release","A network color scheme","A backup format","A database index"],"answer":0,"difficulty":"Hard","topic":"Deployment"},
        {"q":"Why use a queue between services?","options":["Buffer work and decouple producers from consumers","Increase password length","Replace all databases","Disable retries"],"answer":0,"difficulty":"Hard","topic":"Distributed systems"},
        {"q":"What does least privilege mean in cloud IAM?","options":["Grant only required permissions","Give every service admin access","Share one root key","Disable audit logs"],"answer":0,"difficulty":"Hard","topic":"Identity and access"}
      ]'::jsonb
      WHEN 'Cybersecurity' THEN '[
        {"q":"What does confidentiality protect?","options":["Information from unauthorized disclosure","Only uptime","Disk speed","Source formatting"],"answer":0,"difficulty":"Easy","topic":"Security principles"},
        {"q":"What is phishing?","options":["Deceptive communication to steal information","A backup method","A compiler warning","A network cable"],"answer":0,"difficulty":"Easy","topic":"Social engineering"},
        {"q":"Which is a strong authentication factor?","options":["A hardware security key","A public username","A page title","A file name"],"answer":0,"difficulty":"Easy","topic":"Authentication"},
        {"q":"What does HTTPS protect with TLS?","options":["Data in transit","A database schema","A monitor panel","A keyboard"],"answer":0,"difficulty":"Easy","topic":"Network security"},
        {"q":"What is malware?","options":["Malicious software","A secure token","A backup copy","A database view"],"answer":0,"difficulty":"Easy","topic":"Threats"},
        {"q":"Why salt passwords before hashing?","options":["Make precomputed attacks harder","Make them reversible","Share them safely","Remove authentication"],"answer":0,"difficulty":"Medium","topic":"Cryptography"},
        {"q":"What does a firewall primarily control?","options":["Network traffic by rules","Employee salaries","Source indentation","Image size"],"answer":0,"difficulty":"Medium","topic":"Network security"},
        {"q":"What is SQL injection?","options":["Injecting SQL through untrusted input","Encrypting a query","Compressing a table","Backing up a database"],"answer":0,"difficulty":"Medium","topic":"Application security"},
        {"q":"Why apply security patches promptly?","options":["Fix known vulnerabilities","Increase screen brightness","Change usernames","Remove audit trails"],"answer":0,"difficulty":"Medium","topic":"Vulnerability management"},
        {"q":"What does MFA require?","options":["More than one authentication factor","Multiple usernames only","A longer URL","Several databases"],"answer":0,"difficulty":"Medium","topic":"Authentication"},
        {"q":"What is defense in depth?","options":["Multiple independent security controls","One perimeter rule","No monitoring","Public credentials"],"answer":0,"difficulty":"Hard","topic":"Security architecture"},
        {"q":"What is a zero-day vulnerability?","options":["A vulnerability without an available patch or prior disclosure","A daily backup","A deleted account","A harmless scan"],"answer":0,"difficulty":"Hard","topic":"Threats"},
        {"q":"What does a nonce help prevent in some protocols?","options":["Replay of an old message","All malware","Database duplication","Packet routing"],"answer":0,"difficulty":"Hard","topic":"Cryptography"},
        {"q":"What is the purpose of an incident response plan?","options":["Coordinate detection, containment, and recovery","Design a logo","Optimize CSS","Create test data"],"answer":0,"difficulty":"Hard","topic":"Incident response"},
        {"q":"Why should logs be protected from tampering?","options":["They support trustworthy investigation","They improve compression","They replace passwords","They remove alerts"],"answer":0,"difficulty":"Hard","topic":"Monitoring"}
      ]'::jsonb
      WHEN 'Excel' THEN '[
        {"q":"Which symbol starts a formula?","options":["=","#","@","$"],"answer":0,"difficulty":"Easy","topic":"Formulas"},
        {"q":"What does SUM calculate?","options":["A total","A lookup","A date","A filter"],"answer":0,"difficulty":"Easy","topic":"Functions"},
        {"q":"What is a worksheet cell identified by?","options":["Column letter and row number","File extension only","Chart title","Sheet color"],"answer":0,"difficulty":"Easy","topic":"Workbook basics"},
        {"q":"Which chart is useful for trends over time?","options":["Line chart","Pie chart only","Icon set","Slicer"],"answer":0,"difficulty":"Easy","topic":"Charts"},
        {"q":"What does sorting do?","options":["Reorders rows by a key","Deletes formulas","Changes file type","Encrypts cells"],"answer":0,"difficulty":"Easy","topic":"Data management"},
        {"q":"What does an absolute reference such as $A$1 do?","options":["Stays fixed when copied","Always sorts","Creates a chart","Removes a row"],"answer":0,"difficulty":"Medium","topic":"References"},
        {"q":"Which function looks up a value in a table?","options":["XLOOKUP","SUM","ROUND","TODAY"],"answer":0,"difficulty":"Medium","topic":"Lookups"},
        {"q":"What does a pivot table provide?","options":["Interactive summaries","Source code compilation","Password storage","Image editing"],"answer":0,"difficulty":"Medium","topic":"Pivot tables"},
        {"q":"What does conditional formatting change?","options":["Appearance based on rules","Cell ownership","Workbook path","Formula language"],"answer":0,"difficulty":"Medium","topic":"Formatting"},
        {"q":"Why use data validation?","options":["Restrict or guide allowed input","Increase file size","Hide all formulas","Create a database"],"answer":0,"difficulty":"Medium","topic":"Data quality"},
        {"q":"What does Power Query primarily support?","options":["Repeatable data import and transformation","Slide design","Email delivery","Password hashing"],"answer":0,"difficulty":"Hard","topic":"Data transformation"},
        {"q":"What is a circular reference?","options":["A formula depends on itself through a chain","A round chart","A duplicate sheet","A protected cell"],"answer":0,"difficulty":"Hard","topic":"Formula auditing"},
        {"q":"Why use a named range?","options":["Give a meaningful reusable reference","Encrypt a workbook","Remove duplicates","Create a macro automatically"],"answer":0,"difficulty":"Hard","topic":"Workbook design"},
        {"q":"What does a what-if data table analyze?","options":["Outputs for varying inputs","Only text spelling","Sheet colors","File permissions"],"answer":0,"difficulty":"Hard","topic":"Scenario analysis"},
        {"q":"Which practice improves a reporting workbook?","options":["Separate raw data, calculations, and presentation","Mix all data randomly","Use merged cells everywhere","Hide every assumption"],"answer":0,"difficulty":"Hard","topic":"Reporting"}
      ]'::jsonb
      WHEN 'Java' THEN '[
        {"q":"Which keyword declares a class?","options":["class","type","struct","object"],"answer":0,"difficulty":"Easy","topic":"Classes"},
        {"q":"Which type stores true or false?","options":["boolean","bit","logical","truth"],"answer":0,"difficulty":"Easy","topic":"Types"},
        {"q":"Which collection disallows duplicate elements?","options":["Set","List","Queue","Array"],"answer":0,"difficulty":"Easy","topic":"Collections"},
        {"q":"Which method starts a Java application?","options":["main","start","run","init"],"answer":0,"difficulty":"Easy","topic":"Program structure"},
        {"q":"What does `new` do?","options":["Creates an object","Deletes a class","Imports a package","Catches an exception"],"answer":0,"difficulty":"Easy","topic":"Objects"},
        {"q":"What is method overloading?","options":["Same name with different parameter lists","Replacing a parent method","Hiding a field","Creating a thread"],"answer":0,"difficulty":"Medium","topic":"Polymorphism"},
        {"q":"Which construct handles checked exceptions?","options":["try/catch or throws","if only","switch only","finalize only"],"answer":0,"difficulty":"Medium","topic":"Exceptions"},
        {"q":"What does an interface define?","options":["A contract of methods and constants","A database table","A memory address","A package file"],"answer":0,"difficulty":"Medium","topic":"Interfaces"},
        {"q":"What does garbage collection reclaim?","options":["Unreachable objects","All static fields","Source files","CPU registers"],"answer":0,"difficulty":"Medium","topic":"Memory"},
        {"q":"Which stream is commonly used for character text?","options":["Reader","InputStream","ByteBuffer only","Socket"],"answer":0,"difficulty":"Medium","topic":"I/O"},
        {"q":"What does `final` on a method prevent?","options":["Overriding","Calling","Compilation","Overloading"],"answer":0,"difficulty":"Hard","topic":"Inheritance"},
        {"q":"What is the purpose of generics?","options":["Compile-time type safety for reusable code","Automatic threading","Database locking","Bytecode encryption"],"answer":0,"difficulty":"Hard","topic":"Generics"},
        {"q":"What can synchronized protect?","options":["A critical section from unsafe concurrent access","A class from inheritance","A file from deletion","A package from imports"],"answer":0,"difficulty":"Hard","topic":"Concurrency"},
        {"q":"What does a stream pipeline typically produce?","options":["A result from chained transformations","A new thread always","A database schema","A checked exception"],"answer":0,"difficulty":"Hard","topic":"Streams"},
        {"q":"Why prefer composition over inheritance in many designs?","options":["It reduces rigid coupling between behaviors","It disables polymorphism","It removes interfaces","It prevents testing"],"answer":0,"difficulty":"Hard","topic":"Design"}
      ]'::jsonb
      WHEN 'Machine Learning' THEN '[
        {"q":"What is a feature?","options":["An input variable","A target prediction only","A chart color","A model file"],"answer":0,"difficulty":"Easy","topic":"Data"},
        {"q":"What is supervised learning trained with?","options":["Labeled examples","No data","Only passwords","Unordered logs"],"answer":0,"difficulty":"Easy","topic":"Learning types"},
        {"q":"What does classification predict?","options":["A category","A continuous value only","A database key","A timestamp"],"answer":0,"difficulty":"Easy","topic":"Tasks"},
        {"q":"What is a test set used for?","options":["Estimate performance on unseen data","Train every parameter","Clean labels","Choose a chart"],"answer":0,"difficulty":"Easy","topic":"Evaluation"},
        {"q":"What does accuracy measure?","options":["Fraction of correct predictions","Average feature value","Training duration","Number of rows"],"answer":0,"difficulty":"Easy","topic":"Metrics"},
        {"q":"What is overfitting?","options":["Memorizing training patterns and generalizing poorly","Using too little data only","Deleting features","Improving test scores"],"answer":0,"difficulty":"Medium","topic":"Generalization"},
        {"q":"Why scale features for some models?","options":["Put numeric magnitudes on comparable scales","Create labels","Remove the target","Encrypt data"],"answer":0,"difficulty":"Medium","topic":"Preprocessing"},
        {"q":"What does cross-validation estimate?","options":["Performance across data splits","A database join","A feature name","A deployment region"],"answer":0,"difficulty":"Medium","topic":"Evaluation"},
        {"q":"What does precision measure?","options":["Correct positives among predicted positives","All correct rows","Correct negatives only","Training loss"],"answer":0,"difficulty":"Medium","topic":"Metrics"},
        {"q":"What does regularization discourage?","options":["Overly complex model parameters","Data splitting","Feature names","Evaluation"],"answer":0,"difficulty":"Medium","topic":"Regularization"},
        {"q":"Why is data leakage harmful?","options":["It gives training information unavailable at prediction time","It reduces file size","It improves fairness automatically","It changes labels correctly"],"answer":0,"difficulty":"Hard","topic":"Data quality"},
        {"q":"What is gradient descent optimizing?","options":["A loss function","A database index","A chart type","A random seed only"],"answer":0,"difficulty":"Hard","topic":"Optimization"},
        {"q":"What does ROC-AUC summarize?","options":["Ranking ability across classification thresholds","Regression error only","Feature count","Training memory"],"answer":0,"difficulty":"Hard","topic":"Metrics"},
        {"q":"Why use a confusion matrix?","options":["Inspect types of classification errors","Normalize features","Choose a server","Store embeddings"],"answer":0,"difficulty":"Hard","topic":"Evaluation"},
        {"q":"What is class imbalance?","options":["Unequal frequencies of target classes","Missing feature names","Too many models","Duplicate columns only"],"answer":0,"difficulty":"Hard","topic":"Data"},
        {"q":"What is an embedding?","options":["A learned numeric representation","A database password","A label encoder only","A chart legend"],"answer":0,"difficulty":"Medium","topic":"Representations"}
      ]'::jsonb
      WHEN 'Node.js' THEN '[
        {"q":"What runtime executes JavaScript outside the browser?","options":["Node.js","HTML","CSS","SQL"],"answer":0,"difficulty":"Easy","topic":"Runtime"},
        {"q":"Which object exposes command-line arguments?","options":["process.argv","console.args","node.params","global.cli"],"answer":0,"difficulty":"Easy","topic":"Runtime"},
        {"q":"What does npm manage?","options":["JavaScript packages","Database rows","CSS pixels","TLS certificates only"],"answer":0,"difficulty":"Easy","topic":"Packages"},
        {"q":"Which module reads files?","options":["fs","http only","pathless","events only"],"answer":0,"difficulty":"Easy","topic":"File system"},
        {"q":"What is a callback?","options":["A function passed to run later","A server port","A package lock","A database table"],"answer":0,"difficulty":"Easy","topic":"Asynchronous code"},
        {"q":"What does the event loop coordinate?","options":["Non-blocking callbacks and I/O","CSS rendering","SQL schemas","Password hashing only"],"answer":0,"difficulty":"Medium","topic":"Event loop"},
        {"q":"What does `require` or `import` provide?","options":["Module functionality","A browser cookie","A TCP packet","A log rotation"],"answer":0,"difficulty":"Medium","topic":"Modules"},
        {"q":"Which module creates an HTTP server?","options":["http","crypto only","buffer only","assert only"],"answer":0,"difficulty":"Medium","topic":"HTTP servers"},
        {"q":"Why use streams for large files?","options":["Process data incrementally","Load everything twice","Disable backpressure","Avoid all errors"],"answer":0,"difficulty":"Medium","topic":"Streams"},
        {"q":"What does middleware commonly do?","options":["Process a request before the final handler","Compile the kernel","Create a database schema","Change DNS"],"answer":0,"difficulty":"Medium","topic":"Web frameworks"},
        {"q":"What is backpressure?","options":["Slowing a producer when a consumer cannot keep up","A password policy","A routing table","A cache miss"],"answer":0,"difficulty":"Hard","topic":"Streams"},
        {"q":"Why avoid blocking the event loop?","options":["It delays other requests","It improves concurrency","It encrypts traffic","It validates schemas"],"answer":0,"difficulty":"Hard","topic":"Performance"},
        {"q":"What does a worker thread help with?","options":["CPU-intensive work away from the main loop","Replacing HTTP","Storing cookies","Creating CSS"],"answer":0,"difficulty":"Hard","topic":"Concurrency"},
        {"q":"What should a production server do with rejected Promises?","options":["Handle or surface them deliberately","Ignore all errors","Restart every request","Send passwords"],"answer":0,"difficulty":"Hard","topic":"Reliability"},
        {"q":"Why validate request bodies on the server?","options":["Clients can send untrusted data","Browsers always validate fully","It replaces authentication","It removes logging"],"answer":0,"difficulty":"Hard","topic":"Security"}
      ]'::jsonb
      WHEN 'Problem Solving' THEN '[
        {"q":"What is the first step in solving an unfamiliar problem?","options":["Clarify the goal and constraints","Start coding randomly","Ignore examples","Optimize immediately"],"answer":0,"difficulty":"Easy","topic":"Problem framing"},
        {"q":"What does decomposition mean?","options":["Break a problem into smaller parts","Delete requirements","Skip testing","Choose a color"],"answer":0,"difficulty":"Easy","topic":"Decomposition"},
        {"q":"Why write a small example?","options":["Make expected behavior concrete","Guarantee performance","Avoid requirements","Replace implementation"],"answer":0,"difficulty":"Easy","topic":"Examples"},
        {"q":"What is a constraint?","options":["A condition the solution must satisfy","A code comment","A UI color","A random result"],"answer":0,"difficulty":"Easy","topic":"Requirements"},
        {"q":"What does debugging seek?","options":["The cause of incorrect behavior","A new feature only","A larger screen","A database vendor"],"answer":0,"difficulty":"Easy","topic":"Debugging"},
        {"q":"What is a useful first debugging action?","options":["Reproduce the issue reliably","Change many files","Delete logs","Guess the cause"],"answer":0,"difficulty":"Medium","topic":"Debugging"},
        {"q":"Why compare alternatives before choosing?","options":["Evaluate trade-offs","Avoid all decisions","Increase code size","Hide constraints"],"answer":0,"difficulty":"Medium","topic":"Trade-offs"},
        {"q":"What does a hypothesis provide during investigation?","options":["A testable explanation","A final guarantee","A UI component","A deployment key"],"answer":0,"difficulty":"Medium","topic":"Reasoning"},
        {"q":"What is an invariant?","options":["A property that remains true","A random input","A code formatter","A user role"],"answer":0,"difficulty":"Medium","topic":"Correctness"},
        {"q":"Why use a decision table?","options":["Map combinations of conditions to outcomes","Store passwords","Render CSS","Measure latency only"],"answer":0,"difficulty":"Medium","topic":"Analysis"},
        {"q":"What is root-cause analysis intended to avoid?","options":["Treating symptoms without fixing the cause","Writing tests","Gathering evidence","Documenting decisions"],"answer":0,"difficulty":"Hard","topic":"Root cause"},
        {"q":"What does a counterexample show?","options":["A claimed rule fails for at least one case","A solution is optimal","A system is secure","A task is complete"],"answer":0,"difficulty":"Hard","topic":"Proof and testing"},
        {"q":"Why analyze worst-case complexity?","options":["Understand behavior under demanding inputs","Predict UI color","Remove requirements","Choose a password"],"answer":0,"difficulty":"Hard","topic":"Complexity"},
        {"q":"What is a good decomposition boundary?","options":["A part with a clear responsibility","A random line count","Every single statement","A hidden dependency"],"answer":0,"difficulty":"Hard","topic":"Design"},
        {"q":"When should optimization usually happen?","options":["After correctness and measurement","Before understanding the problem","Instead of tests","Only after release"],"answer":0,"difficulty":"Hard","topic":"Optimization"}
      ]'::jsonb
      WHEN 'React' THEN '[
        {"q":"What is a React component?","options":["A reusable UI unit","A database table","A CSS file only","A server port"],"answer":0,"difficulty":"Easy","topic":"Components"},
        {"q":"Which syntax describes React elements?","options":["JSX","SQL","YAML","CSV"],"answer":0,"difficulty":"Easy","topic":"JSX"},
        {"q":"What does a prop provide?","options":["Input from a parent component","A global database","A CSS reset","A server socket"],"answer":0,"difficulty":"Easy","topic":"Props"},
        {"q":"What does useState return?","options":["State value and setter","A route table","A DOM node only","A Promise only"],"answer":0,"difficulty":"Easy","topic":"State"},
        {"q":"Why provide a list key?","options":["Help React identify items","Encrypt list data","Sort automatically","Create a database ID"],"answer":0,"difficulty":"Easy","topic":"Lists"},
        {"q":"When does useEffect run with an empty dependency array?","options":["After initial mount","Before every render","Only on server","Never"],"answer":0,"difficulty":"Medium","topic":"Effects"},
        {"q":"What is lifting state up?","options":["Moving shared state to a common parent","Increasing CSS specificity","Adding a server","Deleting props"],"answer":0,"difficulty":"Medium","topic":"State architecture"},
        {"q":"What does a controlled input use?","options":["React state as its value source","Only browser defaults","A database trigger","A CSS variable"],"answer":0,"difficulty":"Medium","topic":"Forms"},
        {"q":"Why avoid mutating state directly?","options":["React may not detect the change correctly","It improves security","It creates a route","It changes JSX syntax"],"answer":0,"difficulty":"Medium","topic":"State updates"},
        {"q":"What does context help avoid?","options":["Passing props through many intermediate components","All network calls","Every rerender","CSS loading"],"answer":0,"difficulty":"Medium","topic":"Context"},
        {"q":"What is a stale closure in an effect?","options":["Using values captured from an older render","A closed browser window","A deleted component","A CSS warning"],"answer":0,"difficulty":"Hard","topic":"Effects"},
        {"q":"Why memoize an expensive calculation?","options":["Avoid recomputing when dependencies are unchanged","Guarantee no renders","Replace state","Encrypt props"],"answer":0,"difficulty":"Hard","topic":"Performance"},
        {"q":"What does reconciliation compare?","options":["Previous and next element trees","Two databases","CSS files","HTTP headers"],"answer":0,"difficulty":"Hard","topic":"Rendering"},
        {"q":"When is a custom hook useful?","options":["To reuse stateful logic","To create a database","To style only one tag","To replace JSX"],"answer":0,"difficulty":"Hard","topic":"Hooks"},
        {"q":"Why use an error boundary?","options":["Contain rendering errors in a subtree","Validate SQL","Speed up CSS","Authenticate users"],"answer":0,"difficulty":"Hard","topic":"Reliability"}
      ]'::jsonb
      WHEN 'Teamwork' THEN '[
        {"q":"What is a shared team goal?","options":["An outcome members work toward together","A private task only","A meeting room","A job title"],"answer":0,"difficulty":"Easy","topic":"Goals"},
        {"q":"Why communicate progress?","options":["Help teammates coordinate work","Avoid all feedback","Hide blockers","Replace planning"],"answer":0,"difficulty":"Easy","topic":"Communication"},
        {"q":"What should a handoff include?","options":["Context, status, and next steps","Only a file name","A personal opinion","No details"],"answer":0,"difficulty":"Easy","topic":"Handoffs"},
        {"q":"What is collaboration?","options":["Working together toward an outcome","Working without dependencies","Avoiding discussion","Duplicating tasks"],"answer":0,"difficulty":"Easy","topic":"Collaboration"},
        {"q":"What is a blocker?","options":["An issue preventing progress","A completed task","A team celebration","A style guide"],"answer":0,"difficulty":"Easy","topic":"Delivery"},
        {"q":"How should a disagreement begin?","options":["Discuss evidence and the shared goal","Assign blame","End communication","Escalate immediately"],"answer":0,"difficulty":"Medium","topic":"Conflict"},
        {"q":"What makes feedback useful?","options":["Specific observations and actionable suggestions","Personal attacks","Vague praise","Rumors"],"answer":0,"difficulty":"Medium","topic":"Feedback"},
        {"q":"Why clarify ownership?","options":["Prevent missed or duplicated work","Reduce transparency","Avoid deadlines","Remove accountability"],"answer":0,"difficulty":"Medium","topic":"Ownership"},
        {"q":"What does inclusive communication do?","options":["Make relevant perspectives easier to contribute","Silence dissent","Use one format always","Skip accessibility"],"answer":0,"difficulty":"Medium","topic":"Inclusion"},
        {"q":"What should a team retrospective examine?","options":["What to continue, stop, and improve","Only individual blame","Salary history","Unrelated news"],"answer":0,"difficulty":"Medium","topic":"Retrospectives"},
        {"q":"How should a team handle a high-risk blocker?","options":["Raise it early with impact and options","Hide it until deadline","Blame another team","Delete the requirement"],"answer":0,"difficulty":"Hard","topic":"Risk management"},
        {"q":"What is psychological safety?","options":["Ability to speak up without fear of humiliation","A password policy","A private office","A legal contract"],"answer":0,"difficulty":"Hard","topic":"Team culture"},
        {"q":"How should priorities be resolved when stakeholders conflict?","options":["Use agreed goals and transparent trade-offs","Choose the loudest person","Ignore both","Work on everything"],"answer":0,"difficulty":"Hard","topic":"Prioritization"},
        {"q":"What makes delegation effective?","options":["Clear outcome, authority, and follow-up","Assigning without context","Keeping all decisions","Avoiding feedback"],"answer":0,"difficulty":"Hard","topic":"Delegation"},
        {"q":"Why document team decisions?","options":["Preserve context and reduce repeated debate","Prevent learning","Hide accountability","Replace communication"],"answer":0,"difficulty":"Hard","topic":"Decision making"}
      ]'::jsonb
      ELSE NULL
    END;

    IF bank IS NULL THEN
      CONTINUE;
    END IF;

    IF assessment_id IS NULL THEN
      INSERT INTO public.skill_assessments (skill_id, title, description, duration_minutes, questions)
      VALUES (skill_row.id, skill_row.name || ' Assessment', 'Comprehensive ' || skill_row.name || ' assessment.', 20, bank);
    ELSE
      UPDATE public.skill_assessments
      SET duration_minutes = 20, questions = bank
      WHERE id = assessment_id
        AND jsonb_array_length(questions) < 15;
    END IF;
  END LOOP;
END $$;
