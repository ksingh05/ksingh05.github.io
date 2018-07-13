% This script allows you to easily navigate between directories.  It was
% designed to make navigation easier and faster when using Matlab via a
% terminal.  This script can also be used to run scripts.  


% Originally written by Jeff Irion (jlirion@math.ucdavis.edu)


clc
clear navigate_folders navigate_row navigate_files
navigate_choice = 1;

while navigate_choice ~= 0
    
    % change to the directory specified last round (unless this is the first round)
    if exist('navigate_folders','var') && navigate_choice > 0
        cd(navigate_folders(navigate_choice).name);
    elseif navigate_choice == -1
        cd ..
    elseif navigate_choice == -2
        % get the list of the files and folders in the current directory
        navigate_files = dir;
    
        % discard the folders and leave only the .m files
        for navigate_row = length(navigate_files):-1:1
            if length(navigate_files(navigate_row).name) < 3 || ~strcmp(navigate_files(navigate_row).name(end-1:end),'.m')
                navigate_files(navigate_row) = [];
            end
        end
    
        % display the list of files
        clc
        fprintf('\n\n');
        fprintf('%s\n\n',pwd);
        fprintf('( 0)  <go back to navigating folders>\n');
        for navigate_row = 1:length(navigate_files)
            fprintf('(%2d)  %s\n',navigate_row,navigate_files(navigate_row).name);
        end
        fprintf('\n\n');
        
        navigate_choice = input('Your selection:  ');
        
        % go back to navigating folders
        if navigate_choice == 0
            navigate_choice = -3;
        
        % execute the specified script
        else
            run(sprintf('%s/%s',pwd,navigate_files(navigate_choice).name));
            clear navigate_folders navigate_row navigate_choice navigate_files
            return
        end
    end

    % get the list of the files and folders in the current directory
    navigate_folders = dir;

    % discard the files and leave only the folders
    for navigate_row = length(navigate_folders):-1:1
        if ~navigate_folders(navigate_row).isdir || strcmp(navigate_folders(navigate_row).name(1),'.')
            navigate_folders(navigate_row) = [];
        end
    end

    % display the list of folders
    clc
    fprintf('\n\n');
    fprintf('%s\n\n',pwd);
    fprintf('(-2)  <execute a script from current directory>\n');
    fprintf('(-1)  ..\n');
    fprintf('( 0)  ''''Stop here''''\n');
    for navigate_row = 1:length(navigate_folders)
        fprintf('(%2d)  %s\n',navigate_row,navigate_folders(navigate_row).name);
    end
    fprintf('\n\n');

    navigate_choice = input('Your selection:  ');
    clc
    
end


clear navigate_folders navigate_row navigate_choice