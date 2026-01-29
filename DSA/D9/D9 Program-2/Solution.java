import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int k = sc.nextInt();
        List<List<Integer>> li = new ArrayList<>();
        help(k,li,new ArrayList<>(),2);
        System.out.print(li);
    }
    static void help(int k,List<List<Integer>> li,List<Integer> lp,int st){
        for(int i = st;i<k;i++){
            if(k%i==0){
                int b = k/i;
                lp.add(i);
                lp.add(b);
                Collections.sort(lp);
                if(!li.contains(lp))li.add(new ArrayList<>(lp));
                lp.remove(lp.size()-1);
                help(b,li,lp,i);
                lp.remove(lp.size()-1);
            }
        }
    }
}