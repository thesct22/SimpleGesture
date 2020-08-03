
% Setup the Import Options and import the data
opts = delimitedTextImportOptions("NumVariables", 5);

% Specify range and delimiter
opts.DataLines = [1, Inf];
opts.Delimiter = ",";

% Specify column names and types
opts.VariableNames = ["x", "y", "z", "ts", "gstre"];
opts.VariableTypes = ["double", "double", "double", "double", "categorical"];

% Specify file level properties
opts.ExtraColumnsRule = "ignore";
opts.EmptyLineRule = "read";

% Specify variable properties
opts = setvaropts(opts, "gstre", "EmptyFieldRule", "auto");

% Import the data
logfile = readtable("parent_directory\SimpleGesture\logfile.txt", opts);


% Clear temporary variables
clear opts

%plot
plot (logfile.ts, logfile.x)
hold on
plot (logfile.ts, logfile.y)
hold on
plot (logfile.ts, logfile.z)
