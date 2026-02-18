import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String[] st = sc.nextLine().split(" ");
        List<Integer> li = help(st);
        long n = sc.nextLong();
        Map<String, Long> seen = new HashMap<>();
        while(n > 0){
            String key = li.toString();
            if(seen.containsKey(key)){
                long cycleLength = seen.get(key) - n;
                n %= cycleLength;
            }
            seen.put(key, n);
            if(n > 0){
                n--;
                li = help(li);
            }
        }
        System.out.print(li);
    }
    static List<Integer> help(List<Integer> li){
        int n = li.size();
        List<Integer> lp = new ArrayList<>();
        lp.add(0);
        for(int i = 1; i < n-1; i++){
            int val = (li.get(i-1).equals(li.get(i+1))) ? 1 : 0;
            lp.add(val);
        }
        lp.add(0);
        return lp;
    }

    static List<Integer> help(String[] st){
        List<Integer> li = new ArrayList<>();
        for(String s : st){
            li.add(Integer.parseInt(s));
        }
        return li;
    }
}
