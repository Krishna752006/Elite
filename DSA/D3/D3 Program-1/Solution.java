import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int k = sc.nextInt();
        int x = sc.nextInt();
        int f = sc.nextInt();
        int arr[] = new int[n];
        int res[] = new int[n-k+1];
        for(int i = 0;i < n;i++){
            arr[i] = sc.nextInt();
        }
        Map<Integer,Integer> mp = new HashMap<>();
        for(int i = 0; i < k;i++){
            if(mp.containsKey(arr[i])) mp.put(arr[i],mp.get(arr[i])+1);
            else mp.put(arr[i],1);
        }
        res[0] = help(mp,x,f);
        int l = 0,r = k,a = 1;
        while(l<=r&&r<n){
            mp.put(arr[l],mp.get(arr[l])-1);
            if(mp.get(arr[l]) == 0) mp.remove(arr[l]);
            l++;
            if(mp.containsKey(arr[r])) mp.put(arr[r],mp.get(arr[r])+1);
            else mp.put(arr[r],1);
            r++;
            res[a] = help(mp,x,f);
            a++;
        }
        for(int i: res)
        System.out.println(i);
    }
    static int help(Map<Integer,Integer> mp,int x,int f){
        int mat[][] = new int[mp.size()][2];
        int a =0;
        for(Map.Entry<Integer,Integer> m1 : mp.entrySet()){
            mat[a][0] = m1.getKey();
            mat[a][1] = m1.getValue() * (int)Math.pow(mat[a][0],f);
            a++;
        }
        Arrays.sort(mat,(c,b) -> b[1]-c[1]);
        int s = 0;
        for(int i = 0;i<x;i++){
            s += mat[i][0] * mp.get(mat[i][0]);
        }
        return s;
    }
}

// Could have used Priority_Queue<...> also