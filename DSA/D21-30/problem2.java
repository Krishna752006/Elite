/*

Imagine you're the curator of an ancient manuscript archive. Each manuscript is 
assigned a unique significance score, and the archive is arranged so that every 
manuscript on the left has a lower score and every manuscript on the right has 
a higher score, forming a special ordered display. Now, for an upcoming exhibition, 
scholars have decided that only manuscripts with significance scores between 
low and high (inclusive) are relevant. Your task is to update the archive by 
removing any manuscripts whose scores fall outside the range [low, high]. 

Importantly, while you remove some manuscripts, you must preserve the relative 
order of the remaining ones—if a manuscript was originally displayed as a 
descendant of another, that relationship should remain intact. It can be proven 
that there is a unique way to update the archive.

Return the main manuscript of the updated archive. Note that the main manuscript 
(the root) may change depending on the given score boundaries.

Input format:
Line 1: space separated scores to build the manuscript archive
Line 2: two space seperated integers, low and high.

Output format:
space separated scores of the updated archeive

Example 1:
input=
1 0 2
1 2
output=
1 2

Explanation:
Initial archieve:
      1
     / \
    0   2


Updated archieve:
    1
     \
      2
After removing manuscripts scores below 1 (i.e. 0), only the manuscript with 1
and its right manuscript 2 remain.

Example 2:
input=
3 0 4 2 1
1 3
output=
3 2 1

Explanation:
Initial archieve:
          3
         / \
        0   4
         \
          2
         /
        1

Updated archieve:
      3
     /
    2
   /
  1

*/

import java.util.*;

class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String st[] = sc.nextLine().split("\\s+");
        List<Integer> li = new ArrayList<>();
        for (String s : st) {
            li.add(Integer.parseInt(s));
        }
        int l = sc.nextInt();
        int h = sc.nextInt();

        BST b = new BST();
        for (int i : li) {
            b.add(i);
        }

        b.root = b.trim(b.root, l, h);
        b.print();
    }
}

class BST {
    Node root;

    BST() {
        root = null;
    }

    void add(int i) {
        Node n = new Node(i);
        if (root == null) {
            root = n;
            return;
        }
        Node temp = root;
        while (temp != null) {
            if (i < temp.data) {
                if (temp.left == null) { temp.left = n; break; }
                else temp = temp.left;
            } else {
                if (temp.right == null) { temp.right = n; break; }
                else temp = temp.right;
            }
        }
    }

    Node trim(Node n, int lo, int hi) {
        if (n == null) return null;
        if (n.data < lo) return trim(n.right, lo, hi);
        if (n.data > hi) return trim(n.left, lo, hi);
        n.left = trim(n.left, lo, hi);
        n.right = trim(n.right, lo, hi);
        return n;
    }

    void print() {
        print(root);
        System.out.println();
    }

    void print(Node n) {
        if (n == null) return;
        System.out.print(n.data + " ");
        print(n.left);
        print(n.right);
    }
}

class Node {
    Node left, right;
    int data;

    Node(int data) {
        this.data = data;
        left = right = null;
    }
}