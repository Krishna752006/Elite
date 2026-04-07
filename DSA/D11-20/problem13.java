/*

Imagine you’re decoding a secret message that outlines the hierarchical structure 
of a covert spy network. The message is a string composed of numbers and parentheses. 
Here’s how the code works:

- The string always starts with an agent’s identification number, this is the 
  leader of the network.
- After the leader’s ID, there can be zero, one, or two segments enclosed in 
  parentheses. Each segment represents the complete structure of one subordinate 
  network.
- If two subordinate networks are present, the one enclosed in the first (leftmost) 
  pair of parentheses represents the left branch, and the second (rightmost) 
  represents the right branch.

Your mission is to reconstruct the entire spy network hierarchy based on this 
coded message.

Example 1:
Input: 4(2(3)(1))(6(5))
Output: [4, 2, 6, 3, 1, 5]

Spy network:
        4
       / \
      2   6
     / \  /
    3   1 5

Explanation:
Agent 4 is the leader.
Agent 2 (with its own subordinates 3 and 1) is the left branch.
Agent 6 (with subordinate 5) is the right branch.

Example 2:
Input: 4(2(3)(-1))(6(5)(7))
Output: [4, 2, 6, 3, -1, 5, 7]

Spy network:
         4
       /   \
      2     6
     / \   / \
    3   1 5   7

Explanation:
Agent 4 leads the network.
Agent 2 with subordinates 3 and 1 forms the left branch.
Agent 6 with subordinates 5 and 7 forms the right branch.

*/

import java.util.*;

class Node {
    int v;
    Node l, r;

    Node(int v) {
        this.v = v;
    }
}

public class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.nextLine();
        System.out.println(decode(s));
    }
    public static List<Integer> decode(String s) {
        Node root = build(s);
        return bfs(root);
    }
    private static Node build(String s) {
        Deque<Node> st = new ArrayDeque<>();
        int i = 0;
        Node root = null;
        while (i < s.length()) {
            char c = s.charAt(i);
            if (c == '(') i++;
            else if (c == ')') {
                st.pop();
                i++;
            } 
            else {
                int j = i;
                while (i < s.length() &&
                      (s.charAt(i) == '-' || Character.isDigit(s.charAt(i)))) {
                    i++;
                }
                Node n = new Node(Integer.parseInt(s.substring(j, i)));
                if (!st.isEmpty()) {
                    Node p = st.peek();
                    if (p.l == null) p.l = n;
                    else p.r = n;
                } else {
                    root = n;
                }
                st.push(n);
            }
        }
        return root;
    }
    private static List<Integer> bfs(Node root) {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
        Queue<Node> q = new ArrayDeque<>();
        q.offer(root);
        while (!q.isEmpty()) {
            Node n = q.poll();
            res.add(n.v);
            if (n.l != null) q.offer(n.l);
            if (n.r != null) q.offer(n.r);
        }
        return res;
    }
}