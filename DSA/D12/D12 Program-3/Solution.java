import java.util.*;

class TreeNode {
    Integer val;
    TreeNode left, right;

    TreeNode(Integer val) {
        this.val = val;
    }
}

class BT {
    TreeNode root;

    BT(int[] arr) {
        root = build(arr, 0);
    }

    TreeNode build(int[] arr, int i) {
        if (i >= arr.length || arr[i] == -1) return null;
        TreeNode n = new TreeNode(arr[i]);
        n.left = build(arr, 2 * i + 1);
        n.right = build(arr, 2 * i + 2);
        return n;
    }

    List<Integer> boundary() {
        List<Integer> res = new ArrayList<>();
        if (root == null) return res;
    
        res.add(root.val);
    
        helpleft(res, root.left);
        helpleaf(res, root);
        helpright(res, root.right);
    
        return res;
    }

    void helpleft(List<Integer> li, TreeNode n) {
        while (n != null) {
            if (!(n.left == null && n.right == null))
                li.add(n.val);

            if (n.left != null) n = n.left;
            else n = n.right;
        }
    }

    void helpright(List<Integer> li, TreeNode n) {
        if (n == null) return;
    
        if (n.right != null) {
            helpright(li, n.right);
            if (!(n.left == null && n.right == null))
                li.add(n.val);
        } 
        else if (n.left != null) {
            helpright(li, n.left);
            if (!(n.left == null && n.right == null))
                li.add(n.val);
        }
    }

    void helpleaf(List<Integer> li, TreeNode n) {
        if (n == null) return;
    
        if (n.left == null && n.right == null) {
            if (n != root) li.add(n.val);
            return;
        }
    
        helpleaf(li, n.left);
        helpleaf(li, n.right);
    }
}

class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] st = sc.nextLine().split(" ");
        int[] arr = wow(st);

        BT b = new BT(arr);
        List<Integer> lt = b.boundary();
        System.out.print(lt);
    }

    static int[] wow(String[] st) {
        int n = st.length;
        int arr[] = new int[n];
        for (int i = 0; i < n; i++) {
            arr[i] = Integer.parseInt(st[i]);
        }
        return arr;
    }
}
