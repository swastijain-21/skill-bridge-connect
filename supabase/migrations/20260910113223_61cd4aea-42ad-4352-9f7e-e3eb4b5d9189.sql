
INSERT INTO public.skills (id, name, category, demand_score, description) VALUES
 ('00000000-0000-0000-0000-000000000001','Python','technical',95,'General purpose programming for data and backend'),
 ('00000000-0000-0000-0000-000000000002','SQL','technical',92,'Relational querying and data modelling'),
 ('00000000-0000-0000-0000-000000000003','Data Analysis','technical',88,'Cleaning, exploring and interpreting data'),
 ('00000000-0000-0000-0000-000000000004','Power BI','technical',74,'Business intelligence dashboards'),
 ('00000000-0000-0000-0000-000000000005','Machine Learning','technical',85,'Predictive modelling and evaluation'),
 ('00000000-0000-0000-0000-000000000006','JavaScript','technical',90,'Web programming language'),
 ('00000000-0000-0000-0000-000000000007','React','technical',86,'Component based UI development'),
 ('00000000-0000-0000-0000-000000000008','Node.js','technical',78,'Server side JavaScript runtime'),
 ('00000000-0000-0000-0000-000000000009','Java','technical',80,'Enterprise application development'),
 ('00000000-0000-0000-0000-000000000010','Cloud Computing','technical',82,'AWS / Azure fundamentals and deployment'),
 ('00000000-0000-0000-0000-000000000011','Excel','technical',65,'Spreadsheet modelling and reporting'),
 ('00000000-0000-0000-0000-000000000012','Communication','soft',89,'Clear written and verbal communication'),
 ('00000000-0000-0000-0000-000000000013','Teamwork','soft',77,'Collaboration in cross functional teams'),
 ('00000000-0000-0000-0000-000000000014','Problem Solving','soft',84,'Structured analytical thinking'),
 ('00000000-0000-0000-0000-000000000015','Cybersecurity','technical',72,'Secure systems and threat awareness');

INSERT INTO public.institutions (id, name, code, city, state, type, established) VALUES
 ('10000000-0000-0000-0000-000000000001','Sardar Patel Institute of Technology','SPIT','Pune','Maharashtra','Autonomous Engineering College',1994),
 ('10000000-0000-0000-0000-000000000002','Coastal Engineering College','CEC','Kochi','Kerala','State University College',2001),
 ('10000000-0000-0000-0000-000000000003','Northern Institute of Science and Technology','NIST','Jaipur','Rajasthan','Deemed University',1988);

INSERT INTO public.companies (id, name, sector, website, location, size, description) VALUES
 ('20000000-0000-0000-0000-000000000001','NexaSoft Technologies','Information Technology','https://nexasoft.example','Pune','500-1000','Product engineering and cloud modernisation services.'),
 ('20000000-0000-0000-0000-000000000002','BharatCloud Systems','Cloud Infrastructure','https://bharatcloud.example','Bengaluru','1000+','Sovereign cloud and platform engineering for public sector.'),
 ('20000000-0000-0000-0000-000000000003','Vriddhi Analytics','Data and Analytics','https://vriddhi.example','Hyderabad','200-500','Analytics consulting for BFSI and retail.'),
 ('20000000-0000-0000-0000-000000000004','MedixCare Informatics','Health Technology','https://medixcare.example','Kochi','100-200','Clinical data platforms and hospital informatics.'),
 ('20000000-0000-0000-0000-000000000005','GreenGrid Energy','Energy and Sustainability','https://greengrid.example','Jaipur','200-500','Smart grid analytics and renewable asset monitoring.');

INSERT INTO public.students (id, institution_id, full_name, email, phone, department, degree, graduation_year, cgpa, location, bio) VALUES
 ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','Ananya Sharma','ananya.sharma@spit.example','+91 98200 11001','Computer Science','B.Tech',2026,8.60,'Pune','Aspiring data analyst with a strong Python and statistics base.'),
 ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','Rahul Verma','rahul.verma@spit.example','+91 98200 11002','Information Technology','B.Tech',2026,7.90,'Pune','Full stack learner focused on React and Node.'),
 ('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000002','Priya Nair','priya.nair@cec.example','+91 98200 11003','Data Science','B.Tech',2027,8.90,'Kochi','Machine learning enthusiast, campus analytics club lead.'),
 ('30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000002','Arjun Mehta','arjun.mehta@cec.example','+91 98200 11004','Electronics','B.Tech',2026,7.20,'Kochi','Embedded systems background, moving into cloud.'),
 ('30000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000003','Sneha Iyer','sneha.iyer@nist.example','+91 98200 11005','Computer Science','B.Tech',2027,9.10,'Jaipur','Backend developer and competitive programmer.'),
 ('30000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000003','Karthik Reddy','karthik.reddy@nist.example','+91 98200 11006','Information Technology','B.Tech',2026,6.80,'Jaipur','Interested in cybersecurity and cloud operations.'),
 ('30000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000001','Fatima Khan','fatima.khan@spit.example','+91 98200 11007','Data Science','B.Tech',2026,8.30,'Pune','Business intelligence and reporting focus.'),
 ('30000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000002','Rohan Das','rohan.das@cec.example','+91 98200 11008','Mechanical','B.Tech',2026,7.00,'Kochi','Transitioning to analytics through self study.'),
 ('30000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000003','Divya Menon','divya.menon@nist.example','+91 98200 11009','Computer Science','B.Tech',2027,8.75,'Jaipur','Frontend engineering and accessibility advocate.'),
 ('30000000-0000-0000-0000-000000000010','10000000-0000-0000-0000-000000000001','Aman Gupta','aman.gupta@spit.example','+91 98200 11010','Information Technology','B.Tech',2026,7.60,'Pune','Cloud and DevOps learner.');

INSERT INTO public.student_skills (student_id, skill_id, proficiency, source)
SELECT ('30000000-0000-0000-0000-'||lpad(v.s::text,12,'0'))::uuid,
       ('00000000-0000-0000-0000-'||lpad(v.k::text,12,'0'))::uuid, v.p, 'assessment'
FROM (VALUES
 (1,1,85),(1,2,62),(1,3,75),(1,4,40),(1,12,70),(1,14,72),(1,11,68),
 (2,6,80),(2,7,74),(2,8,66),(2,2,58),(2,12,65),(2,13,70),
 (3,1,90),(3,5,82),(3,3,86),(3,2,78),(3,4,55),(3,14,80),
 (4,9,60),(4,10,52),(4,14,58),(4,12,55),(4,13,62),
 (5,9,88),(5,2,80),(5,8,72),(5,14,86),(5,10,60),(5,12,58),
 (6,15,64),(6,10,58),(6,2,45),(6,12,50),(6,13,55),
 (7,4,78),(7,11,84),(7,2,70),(7,3,72),(7,12,80),(7,1,45),
 (8,11,62),(8,3,48),(8,12,66),(8,13,70),(8,2,35),
 (9,6,82),(9,7,86),(9,12,76),(9,13,74),(9,8,55),
 (10,10,74),(10,1,58),(10,2,52),(10,15,50),(10,14,64)
) AS v(s,k,p);

INSERT INTO public.projects (student_id, title, description, tech_stack) VALUES
 ('30000000-0000-0000-0000-000000000001','Retail Sales Insights Dashboard','Analysed two years of retail transactions and built an interactive reporting layer.','{Python,SQL,Excel}'),
 ('30000000-0000-0000-0000-000000000001','Campus Placement Predictor','Logistic regression model predicting placement likelihood from academic data.','{Python,"Machine Learning"}'),
 ('30000000-0000-0000-0000-000000000002','Student Mess Management App','React and Node application used by 400 hostel residents.','{React,Node.js,SQL}'),
 ('30000000-0000-0000-0000-000000000003','Crop Yield Forecasting','Time series models on district level agriculture data.','{Python,"Machine Learning",SQL}'),
 ('30000000-0000-0000-0000-000000000005','Distributed Job Scheduler','Java based scheduler with fault tolerant workers.','{Java,SQL}'),
 ('30000000-0000-0000-0000-000000000007','Hospital KPI Reporting','Power BI reporting suite for outpatient operations.','{"Power BI",Excel,SQL}'),
 ('30000000-0000-0000-0000-000000000009','Accessible Design System','WCAG compliant component library for college portals.','{React,JavaScript}');

INSERT INTO public.certifications (student_id, title, issuer, issue_date) VALUES
 ('30000000-0000-0000-0000-000000000001','Google Data Analytics','Coursera','2025-06-14'),
 ('30000000-0000-0000-0000-000000000003','Machine Learning Specialisation','DeepLearning.AI','2025-03-02'),
 ('30000000-0000-0000-0000-000000000005','Oracle Certified Java Associate','Oracle','2025-01-20'),
 ('30000000-0000-0000-0000-000000000006','Security+','CompTIA','2025-08-11'),
 ('30000000-0000-0000-0000-000000000010','AWS Cloud Practitioner','Amazon Web Services','2025-05-05');

INSERT INTO public.skill_assessments (id, skill_id, title, description, duration_minutes, questions) VALUES
 ('50000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000001','Python Fundamentals Assessment','Core syntax, data structures and functions.',10,
  '[{"q":"Which data type is immutable in Python?","options":["list","dict","tuple","set"],"answer":2},
    {"q":"What does len([1,2,3]) return?","options":["2","3","4","Error"],"answer":1},
    {"q":"Which keyword defines a function?","options":["func","define","def","function"],"answer":2},
    {"q":"What is the output of 7 // 2?","options":["3.5","3","4","2"],"answer":1},
    {"q":"Which library is used for dataframes?","options":["numpy","pandas","flask","pytest"],"answer":1}]'::jsonb),
 ('50000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000002','SQL Proficiency Assessment','Joins, aggregation and filtering.',10,
  '[{"q":"Which clause filters grouped rows?","options":["WHERE","HAVING","ORDER BY","LIMIT"],"answer":1},
    {"q":"Which join returns only matching rows in both tables?","options":["LEFT JOIN","FULL JOIN","INNER JOIN","CROSS JOIN"],"answer":2},
    {"q":"Which function counts rows?","options":["SUM()","COUNT()","AVG()","TOTAL()"],"answer":1},
    {"q":"Which keyword removes duplicate rows?","options":["UNIQUE","DISTINCT","SEPARATE","ONLY"],"answer":1},
    {"q":"A primary key must be...","options":["Nullable","Duplicated","Unique and not null","Text only"],"answer":2}]'::jsonb),
 ('50000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000003','Data Analysis Assessment','Statistics and interpretation.',10,
  '[{"q":"Median is best used when data is...","options":["Normally distributed","Skewed","Categorical","Binary"],"answer":1},
    {"q":"Which chart shows distribution of one numeric variable?","options":["Pie chart","Histogram","Line chart","Map"],"answer":1},
    {"q":"Correlation of 0 means...","options":["Strong link","No linear link","Causation","Perfect link"],"answer":1},
    {"q":"Outliers most affect the...","options":["Median","Mode","Mean","Range of ranks"],"answer":2},
    {"q":"Data cleaning usually happens...","options":["After modelling","Before analysis","Never","Only for images"],"answer":1}]'::jsonb),
 ('50000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000004','Power BI Assessment','Modelling and visualisation basics.',10,
  '[{"q":"DAX is used for...","options":["Styling","Calculations","Networking","Testing"],"answer":1},
    {"q":"Which view defines table relationships?","options":["Report","Model","Data","Query"],"answer":1},
    {"q":"Power Query is mainly for...","options":["Data transformation","Publishing","Security","Printing"],"answer":0},
    {"q":"A measure is evaluated...","options":["Once at import","In row context only","At query time","Never"],"answer":2},
    {"q":"Which visual best shows part to whole?","options":["Scatter","Donut","Gauge","Funnel"],"answer":1}]'::jsonb),
 ('50000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000006','JavaScript Assessment','Language essentials.',10,
  '[{"q":"Which keyword declares a block scoped variable?","options":["var","let","function","global"],"answer":1},
    {"q":"typeof null returns","options":["null","object","undefined","number"],"answer":1},
    {"q":"Promise resolves with","options":["then","catch","finally","await only"],"answer":0},
    {"q":"Array method that returns a new array","options":["push","map","splice","sort"],"answer":1},
    {"q":"=== compares","options":["Value only","Type only","Value and type","References only"],"answer":2}]'::jsonb),
 ('50000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000012','Communication Assessment','Workplace communication judgement.',8,
  '[{"q":"Best first step before a client update call?","options":["Improvise","Prepare an agenda","Send slides after","Skip notes"],"answer":1},
    {"q":"A good status update is","options":["Long and detailed","Concise and specific","Vague","Only verbal"],"answer":1},
    {"q":"When you miss a deadline you should","options":["Stay silent","Flag early with a plan","Blame others","Wait to be asked"],"answer":1},
    {"q":"Active listening means","options":["Interrupting","Paraphrasing to confirm","Multitasking","Taking over"],"answer":1},
    {"q":"Technical writing should prioritise","options":["Jargon","Clarity","Length","Humour"],"answer":1}]'::jsonb);

INSERT INTO public.assessment_results (assessment_id, student_id, score) VALUES
 ('50000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',85),
 ('50000000-0000-0000-0000-000000000002','30000000-0000-0000-0000-000000000001',62),
 ('50000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003',90),
 ('50000000-0000-0000-0000-000000000004','30000000-0000-0000-0000-000000000007',78),
 ('50000000-0000-0000-0000-000000000005','30000000-0000-0000-0000-000000000009',82);

INSERT INTO public.opportunities (id, company_id, title, type, description, location, work_mode, duration, stipend, eligibility, min_cgpa, experience_years, openings, deadline) VALUES
 ('40000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003','Data Analyst Intern','internship','Support the BFSI analytics pod with reporting, SQL extracts and dashboards.','Hyderabad','Hybrid','6 months','INR 25,000/month','Pre-final or final year, any engineering branch',7.00,0,4,'2026-11-30'),
 ('40000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001','Frontend Engineering Intern','internship','Build customer facing React interfaces with our product team.','Pune','On-site','6 months','INR 22,000/month','Final year students with a web portfolio',6.50,0,3,'2026-11-20'),
 ('40000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000002','Cloud Operations Intern','internship','Assist platform engineers with deployments and monitoring.','Bengaluru','On-site','3 months','INR 20,000/month','Any branch, cloud fundamentals required',6.00,0,5,'2026-12-10'),
 ('40000000-0000-0000-0000-000000000004','20000000-0000-0000-0000-000000000004','Health Data Intern','internship','Work on clinical data quality and hospital reporting.','Kochi','Hybrid','4 months','INR 18,000/month','Data Science or CS students',7.00,0,2,'2026-12-01'),
 ('40000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000005','Energy Analytics Intern','internship','Analyse solar asset performance data and build reports.','Jaipur','Remote','6 months','INR 15,000/month','Open to all branches',6.00,0,3,'2026-11-25'),
 ('40000000-0000-0000-0000-000000000006','20000000-0000-0000-0000-000000000001','Backend Development Intern','internship','Build APIs and services for enterprise clients.','Pune','On-site','6 months','INR 24,000/month','CS/IT students with backend projects',7.00,0,3,'2026-12-05'),
 ('40000000-0000-0000-0000-000000000007','20000000-0000-0000-0000-000000000003','Machine Learning Intern','internship','Prototype forecasting models with the data science team.','Hyderabad','Hybrid','6 months','INR 30,000/month','Strong Python and statistics background',7.50,0,2,'2026-12-15'),
 ('40000000-0000-0000-0000-000000000008','20000000-0000-0000-0000-000000000002','Cybersecurity Intern','internship','Support vulnerability assessment and security reviews.','Bengaluru','On-site','3 months','INR 20,000/month','Security certification preferred',6.50,0,2,'2026-11-28'),
 ('40000000-0000-0000-0000-000000000009','20000000-0000-0000-0000-000000000004','Business Intelligence Intern','internship','Own Power BI dashboards for hospital operations.','Kochi','On-site','6 months','INR 19,000/month','Comfort with Excel and BI tools',6.50,0,2,'2026-12-08'),
 ('40000000-0000-0000-0000-000000000010','20000000-0000-0000-0000-000000000005','Field Data Intern','internship','Collect and structure field sensor data for grid analytics.','Jaipur','On-site','3 months','INR 14,000/month','Any branch',6.00,0,4,'2026-11-22'),
 ('40000000-0000-0000-0000-000000000011','20000000-0000-0000-0000-000000000003','Junior Data Analyst','job','Full time analyst role for reporting and insight delivery.','Hyderabad','Hybrid','Full time','INR 7.5 LPA','2026 graduates',7.00,0,6,'2026-12-20'),
 ('40000000-0000-0000-0000-000000000012','20000000-0000-0000-0000-000000000001','Software Engineer (Frontend)','job','Own React features end to end for enterprise products.','Pune','Hybrid','Full time','INR 9 LPA','2026 graduates with web experience',7.00,0,5,'2026-12-18'),
 ('40000000-0000-0000-0000-000000000013','20000000-0000-0000-0000-000000000002','Cloud Engineer','job','Deploy and operate workloads on sovereign cloud.','Bengaluru','On-site','Full time','INR 8.5 LPA','2026 graduates',6.50,0,8,'2026-12-25'),
 ('40000000-0000-0000-0000-000000000014','20000000-0000-0000-0000-000000000005','Data Engineer','job','Build pipelines for renewable asset telemetry.','Jaipur','Hybrid','Full time','INR 8 LPA','Strong SQL and Python',7.00,1,3,'2026-12-30'),
 ('40000000-0000-0000-0000-000000000015','20000000-0000-0000-0000-000000000004','Clinical Data Associate','job','Maintain clinical datasets and reporting standards.','Kochi','On-site','Full time','INR 6.5 LPA','Healthcare interest preferred',6.50,0,4,'2026-12-12'),
 ('40000000-0000-0000-0000-000000000016','20000000-0000-0000-0000-000000000001','Backend Engineer (Java)','job','Design resilient services for large scale clients.','Pune','On-site','Full time','INR 9.5 LPA','Java and SQL strength required',7.50,0,4,'2026-12-28'),
 ('40000000-0000-0000-0000-000000000017','20000000-0000-0000-0000-000000000003','BI Developer','job','Build and maintain executive dashboards.','Hyderabad','Remote','Full time','INR 7 LPA','Power BI experience',6.50,0,3,'2026-12-22'),
 ('40000000-0000-0000-0000-000000000018','20000000-0000-0000-0000-000000000002','Security Analyst','job','Monitor and respond to security events.','Bengaluru','On-site','Full time','INR 8 LPA','Security fundamentals required',6.50,0,2,'2026-12-27');

INSERT INTO public.opportunity_skills (opportunity_id, skill_id, min_proficiency, weight)
SELECT ('40000000-0000-0000-0000-'||lpad(v.o::text,12,'0'))::uuid,
       ('00000000-0000-0000-0000-'||lpad(v.k::text,12,'0'))::uuid, v.m, v.w
FROM (VALUES
 (1,1,80,3),(1,2,75,3),(1,4,70,2),(1,12,60,1),
 (2,6,75,3),(2,7,70,3),(2,12,55,1),
 (3,10,65,3),(3,2,50,2),(3,14,60,2),
 (4,2,65,3),(4,3,70,3),(4,11,60,1),
 (5,3,60,3),(5,11,65,2),(5,4,55,2),
 (6,8,70,3),(6,2,65,2),(6,6,60,2),
 (7,1,80,3),(7,5,75,3),(7,3,70,2),
 (8,15,65,3),(8,10,55,2),(8,14,60,1),
 (9,4,70,3),(9,11,70,2),(9,2,60,2),
 (10,11,55,2),(10,12,60,2),(10,13,55,1),
 (11,2,75,3),(11,3,75,3),(11,4,65,2),(11,12,65,1),
 (12,7,80,3),(12,6,80,3),(12,13,60,1),
 (13,10,75,3),(13,9,60,2),(13,14,65,2),
 (14,1,75,3),(14,2,80,3),(14,10,60,2),
 (15,3,60,3),(15,11,65,2),(15,12,70,2),
 (16,9,80,3),(16,2,70,2),(16,14,70,2),
 (17,4,80,3),(17,2,70,2),(17,3,65,2),
 (18,15,70,3),(18,10,60,2),(18,12,60,1)
) AS v(o,k,m,w);

INSERT INTO public.applications (opportunity_id, student_id, status, match_score, cover_note)
SELECT ('40000000-0000-0000-0000-'||lpad(v.o::text,12,'0'))::uuid,
       ('30000000-0000-0000-0000-'||lpad(v.s::text,12,'0'))::uuid, v.st::public.application_status, v.m, v.note
FROM (VALUES
 (1,1,'shortlisted',82,'Strong Python and analysis background, keen to grow SQL depth.'),
 (1,3,'selected',91,'Data science student with forecasting project experience.'),
 (1,7,'under_review',76,'Reporting and BI focused, comfortable with dashboards.'),
 (2,2,'shortlisted',88,'React and Node projects used by 400 students.'),
 (2,9,'applied',90,'Frontend and accessibility specialist.'),
 (3,10,'under_review',72,'AWS certified and eager for platform work.'),
 (7,3,'shortlisted',89,'ML specialisation completed with applied projects.'),
 (9,7,'applied',80,'Power BI reporting suite built for hospital operations.'),
 (11,1,'applied',78,'Looking to convert analysis skills into a full time role.'),
 (12,9,'under_review',85,'Design system experience with React.'),
 (13,10,'applied',70,'Cloud practitioner certified.'),
 (16,5,'shortlisted',84,'Java scheduler project and strong DSA record.')
) AS v(o,s,st,m,note);

INSERT INTO public.placements (student_id, company_id, opportunity_id, type, package_lpa, placed_on) VALUES
 ('30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000003','40000000-0000-0000-0000-000000000001','internship',NULL,'2026-08-01'),
 ('30000000-0000-0000-0000-000000000005','20000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000016','job',9.50,'2026-09-01'),
 ('30000000-0000-0000-0000-000000000009','20000000-0000-0000-0000-000000000001','40000000-0000-0000-0000-000000000012','job',9.00,'2026-08-20');

INSERT INTO public.feedback (student_id, company_id, rating, comments, skills_endorsed, skills_to_improve) VALUES
 ('30000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000003',4,'Excellent analytical thinking during the screening task. Strengthen SQL window functions and BI storytelling before the next round.','{Python,"Data Analysis"}','{SQL,"Power BI"}'),
 ('30000000-0000-0000-0000-000000000003','20000000-0000-0000-0000-000000000003',5,'Outstanding intern. Delivered a forecasting prototype ahead of schedule.','{Python,"Machine Learning","Data Analysis"}','{"Power BI"}'),
 ('30000000-0000-0000-0000-000000000002','20000000-0000-0000-0000-000000000001',4,'Good frontend fundamentals. Improve database querying for full stack roles.','{React,JavaScript}','{SQL}');

INSERT INTO public.learning_resources (skill_id, title, provider, url, type, level, duration)
SELECT ('00000000-0000-0000-0000-'||lpad(v.k::text,12,'0'))::uuid, v.t, v.p, v.u, v.ty, v.l, v.d
FROM (VALUES
 (1,'Python for Everybody','University of Michigan','https://www.py4e.com','course','beginner','20 hours'),
 (1,'Automate the Boring Stuff','Al Sweigart','https://automatetheboringstuff.com','book','beginner','15 hours'),
 (2,'SQL for Data Analysis','Mode Analytics','https://mode.com/sql-tutorial','course','intermediate','12 hours'),
 (2,'Advanced SQL Window Functions','PostgreSQL Docs','https://www.postgresql.org/docs','guide','advanced','6 hours'),
 (3,'Data Analysis with Pandas','Kaggle Learn','https://www.kaggle.com/learn','course','intermediate','10 hours'),
 (4,'Power BI Essentials','Microsoft Learn','https://learn.microsoft.com/power-bi','course','beginner','14 hours'),
 (4,'DAX Fundamentals','Microsoft Learn','https://learn.microsoft.com/dax','course','intermediate','8 hours'),
 (5,'Machine Learning Specialisation','DeepLearning.AI','https://www.deeplearning.ai','course','intermediate','40 hours'),
 (6,'JavaScript: The Modern Tutorial','javascript.info','https://javascript.info','guide','beginner','25 hours'),
 (7,'React Foundations','React Docs','https://react.dev/learn','course','beginner','12 hours'),
 (8,'Node.js Backend Basics','Node Docs','https://nodejs.org/en/learn','guide','intermediate','10 hours'),
 (9,'Java Programming Masterclass','Oracle Academy','https://academy.oracle.com','course','intermediate','30 hours'),
 (10,'AWS Cloud Practitioner Essentials','AWS Skill Builder','https://skillbuilder.aws','course','beginner','12 hours'),
 (11,'Excel for Analysts','Microsoft Learn','https://learn.microsoft.com/excel','course','beginner','8 hours'),
 (12,'Technical Communication','MIT OpenCourseWare','https://ocw.mit.edu','course','beginner','6 hours'),
 (13,'Working in Agile Teams','Atlassian','https://www.atlassian.com/agile','guide','beginner','4 hours'),
 (14,'Structured Problem Solving','Interview Kickstart','https://interviewkickstart.com','course','intermediate','10 hours'),
 (15,'Cybersecurity Fundamentals','Cisco Networking Academy','https://www.netacad.com','course','beginner','15 hours')
) AS v(k,t,p,u,ty,l,d);
