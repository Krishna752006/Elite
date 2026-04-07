/*

Bubloo is working with computer networks, where servers are connected 
in a hierarchical structure, represented as a Binary Tree. Each server (node) 
is uniquely identified by an integer value.

Bubloo has been assigned an important task: find the shortest communication 
path (in terms of network hops) between two specific servers in the network.

Network Structure:
------------------
The network of servers follows a binary tree topology.
Each server (node) has a unique identifier (integer).
If a server does not exist at a certain position, it is represented as '-1' (NULL).

Given the root of the network tree, and two specific server IDs (E1 & E2), 
determine the minimum number of network hops (edges) required to 
communicate between these two servers.

Input Format:
-------------
Space separated integers, elements of the tree.

Output Format:
--------------
Print an integer value.


Sample Input-1:
---------------
1 2 4 3 5 6 7 8 9 10 11 12
4 8

Sample Output-1:
----------------
4

Explanation:
------------
The edegs between 4 and 8 are: [4,1], [1,2], [2,3], [3,8]


Sample Input-2:
---------------
1 2 4 3 5 6 7 8 9 10 11 12
6 6

Sample Output-2:
----------------
0

Explanation:
------------
No edegs between 6 and 6.

/*

import java.util.*;
class Solution{
    public static void main(String[] args){
        Scanner sc = new Scanner(System.in);
        String st[] = sc.nextLine().split(" ");
        BT b = new BT();
        for(String i: st) b.add(i);
        int c = sc.nextInt();
        int d = sc.nextInt();
        System.out.print(b.help(c,d));
    }
}
class Node{
    int data;
    Node left,right;
    Node(int a){
        data = a;
        left = right = null;
    }
}
class BT{
    Node root;
    BT(){
        root = null;
    }
    boolean a1 = false, b1 = false;
    int help(int a,int b){
        if(a == b) return 0;
        return help(root,a,b);
    }
    int help(Node n,int a,int b){
        if(n == null) return -1;
        if(n.data == a && !a1) {
            a1 = true;
            return 1;
        }
        if(n.data == b && !b1) {
            b1 = true;
            return 1;
        }
        int l = help(n.left,a,b);
        int r = help(n.right,a,b);
        if(l == -1 && r == -1) return -1;
        else if(l == -1 && r != -1) return r+1;
        else if(l != -1 && r == -1) return l+1;
        else return l+r;
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
}