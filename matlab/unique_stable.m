function [c,ia,ic] = unique_stable(a)
% Returns the values of c in the same order as in a.  This is equivalent to
% [c,ia,ic] = unique(a,'stable') in newer versions of MATLAB.  
%
% Input
%   a       a vector
%
% Output
%   c       the unique values in a in their original order
%   ia      c = a(ia)
%   ic      a = c(ic)
%
%
% Originally written by Jeff Irion (jlirion@math.ucdavis.edu)


if ~verLessThan('matlab','8.1')
    [c,ia,ic] = unique(a,'stable');
else
    [~,ia,ic] = unique(a,'first');
    [~,iasort] = sort(ia,'ascend');
    
    ia = ia(iasort);    
    c = a(ia);
    ic = iasort(ic);
end


end
