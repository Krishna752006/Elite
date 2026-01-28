import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String[] s = sc.nextLine().split(" ");
        int[] arr = help(s);
        Queue<Node> q = new LinkedList<>();
        Node root = new Node(arr[0]);
        q.add(root);
        int i = 1;
        int n1 = arr.length;
        while(i<n1){
            Node n = q.remove();
            if(n.value == -1) continue;
            n.left = new Node(arr[i]);
            q.add(n.left);
            i++;
            if(i<n1){
                n.right = new Node(arr[i]);
                q.add(n.right);
                i++;
            }
        }
        help(root);
    }
    static void help(Node root){
        if(root == null || root.value == -1) return;
        help(root.left);
        System.out.print(root.value + " ");
        help(root.right);
    }
    static int[] help(String[] s){
        int[] arr = new int[s.length];
        for(int i = 0;i < s.length;i++){
            arr[i] = Integer.parseInt(s[i]);
        }
        return arr;
    }
}
class Node {
    int value;
    Node left, right;

    public Node(int value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}