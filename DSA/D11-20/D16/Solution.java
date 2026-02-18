import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String st[] = sc.nextLine().split(" ");
        BT b = new BT();
        for(String i: st) b.add(i);
        b.setsum();
        b.help();
        System.out.print(b.max % 1000000007);
    }
}
class Node{
    int data;
    int sum;
    Node left,right;
    Node(int a){
        data = a;
        sum = 0;
        left = right = null;
    }
}
class BT{
    Node root;
    int max = 0;
    BT(){
        root = null;
    }
    void add(String a){
        int a1 = Integer.parseInt(a);
        Node n = new Node(a1);
        if(root == null){
            root = n;
            return;
        }
        Queue<Node> q = new LinkedList<>();
        q.add(root);
        while(!q.isEmpty()){
            Node temp = q.remove();
            if(temp.data == -1) continue;
            if(temp.left == null){
                temp.left = n;
                break;
            }
            if(temp.right == null){
                temp.right = n;
                break;
            }
            if(temp.left != null) q.add(temp.left);
            if(temp.right != null) q.add(temp.right);
        }
    }
    void help(){
        maxhelp(root.left,root.sum);
        maxhelp(root.right,root.sum);
    }
    void maxhelp(Node n,int a){
        if(n == null) return;
        int p = n.sum * (a - n.sum);
        if(p>max)max = p;
        maxhelp(n.left,n.sum);
        maxhelp(n.right,n.sum);
    }
    void setsum(){
        root.data = sumhelp(root);
    }
    int sumhelp(Node n){
        if(n == null || n.data == -1) return 0;
        int l = sumhelp(n.left);
        int r = sumhelp(n.right);
        n.sum = n.data + l + r;
        return n.sum;
    }
}