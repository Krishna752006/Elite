import java.util.*;
class TreeNode {
    Integer val;
    TreeNode left, right;
    
    TreeNode(Integer val) {
        this.val = val;
        this.left = this.right = null;
    }
}
class BT{
    TreeNode root;
    int max = 0;
    BT(){
        root = null;
    }
    void add(int a){
        TreeNode n = new TreeNode(a);
        if(root == null){
            root = n;
            return;
        }
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while(!q.isEmpty()){
            TreeNode n1 = q.remove();
            if(n1.val == -1) continue;
            if(n1.left != null) q.add(n1.left);
            else {
                n1.left = n;
                break;
            }
            if(n1.right != null) q.add(n1.right);
            else{
                n1.right = n;
                break;
            }
        }
    }
    List<Integer> leftview()
    {
        List<Integer> li = new ArrayList<>();
        help(li,1,root);
        return li;
    }
    void help(List<Integer> li,int l,TreeNode n){
        if(n == null || n.val == -1) return;
        if(l>max){
            li.add(n.val);
            max = l;
        }
        help(li,l+1,n.left);
        help(li,l+1,n.right);
    }
}
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String[] st = sc.nextLine().split(" ");
        int[] arr = wow(st);
        BT b = new BT();
        for(int i: arr) b.add(i);
        List<Integer> lt = b.leftview();
        System.out.print(lt);
        
    }
    static int[] wow(String[] st){
        int n = st.length;
        int arr[] = new int[n];
        for(int i = 0;i<n;i++){
            arr[i] = Integer.parseInt(st[i]);
        }
        return arr;
    }
}