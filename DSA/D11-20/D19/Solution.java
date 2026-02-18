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