/*

Balbir Singh is working with Binary Trees.
The elements of the tree is given in the level order format.
Balbir has a task to split the tree into two parts by removing only one edge
in the tree, such that the product of sums of both the splitted-trees should be maximum.

You will be given the root of the binary tree.
Your task is to help the Balbir Singh to split the binary tree as specified.
print the product value, as the product may be large, print the (product % 1000000007)
	
NOTE: 
Please do consider the node with data as '-1' as null in the given trees.

Input Format:
-------------
Space separated integers, elements of the tree.

Output Format:
--------------
Print an integer value.


Sample Input-1:
---------------
1 2 4 3 5 6

Sample Output-1:
----------------
110

Explanation:
------------
if you split the tree by removing edge between 1 and 4, 
then the sums of two trees are 11 and 10. So, the max product is 110.


Sample Input-2:
---------------
3 2 4 3 2 -1 6

Sample Output-2:
----------------
100


*/

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