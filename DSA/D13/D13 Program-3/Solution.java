import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String a = sc.nextLine();
        String b = sc.nextLine();
        int i = 0;
        int j = 0;
        int n = b.length();
        boolean res = true;
        while(j<n && i<a.length()){
            char ch = b.charAt(j);
            if(Character.isDigit(ch)){
                int s = 0;
                if(ch == '0'){
                    res = false;
                    break;
                }
                while(j < n && Character.isDigit(b.charAt(j))){
                    s = s*10+(b.charAt(j) - '0');
                    j++;
                }
                i = i+s;
            }
            else{
                if(ch != a.charAt(i)){
                    res = false;
                    break;
                }
                i++;
                j++;
            }
        }
        if(i != a.length() || j != n) res = false;
        System.out.print(res);
    }
}