import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        System.out.print(help(n,k,0,-1));
    }
    static int help(int n,int k,int num,int pre){
        if(n==0){
            return 1;
        }
        int ways = 0;
        for(int i = 0;i<k;i++){
            if(i==pre){
                if(num<2){
                    ways += help(n-1,k,num+1,i);
                }
            }
            else{
                ways += help(n-1,k,1,i);
            }
        }
        return ways;
    }
}
/* Another Solution
    int count(int n , boolean lastseen)
    if(n==1){
        if(lastseen) return 0;
        else return k;
    }
    if(lastseen)
    return count(n-1,true);
    else
    return count(n-1,true) + count(n-1,false);

    In Main --> Result = count(n,true) + count(n,false);
*/