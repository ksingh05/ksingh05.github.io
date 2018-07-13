function f = idct1(d)
% Perform the inverse DCT-I transform on the column(s) of d.  
% 
% Based on page 88 of "Adapted Wavelet Analysis: from Theory to Software" 
% by M.V. Wickerhauser.  
% 
%
% Originally written by Jeff Irion (jlirion@math.ucdavis.edu)


[N,~] = size(d);
N = N-1;
FUd = fft([sqrt(2)*d(1,:); d(2:end-1,:); sqrt(2)*d(end,:); d(end-1:-1:2,:)]);
f = [sqrt(2)*FUd(1,:); FUd(2:N,:) + FUd(end:-1:N+2,:); sqrt(2)*FUd(N+1,:)]/sqrt(8*N);


end