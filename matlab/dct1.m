function d = dct1(f)
% Perform the DCT-I transform on the column(s) of f.  
% 
% Based on page 88 of "Adapted Wavelet Analysis: from Theory to Software" 
% by M.V. Wickerhauser.  
% 
%
% Originally written by Jeff Irion (jlirion@math.ucdavis.edu)


[N,~] = size(f);
N = N-1;
FUf = ifft([sqrt(2)*f(1,:); f(2:end-1,:); sqrt(2)*f(end,:); f(end-1:-1:2,:)]);
d = [sqrt(2)*FUf(1,:); FUf(2:N,:) + FUf(end:-1:N+2,:); sqrt(2)*FUf(N+1,:)]*sqrt(N/2);


end