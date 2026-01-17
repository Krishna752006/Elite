import java.util.*;

class Solution1 {
    static int P;
    static List<List<Integer>> graph;
    static boolean[] visited;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        P = sc.nextInt();

        graph = new ArrayList<>();
        for (int i = 0; i < P; i++) {
            graph.add(new ArrayList<>());
        }

        // build adjacency list from matrix
        for (int i = 0; i < P; i++) {
            for (int j = 0; j < P; j++) {
                int val = sc.nextInt();
                if (val == 1 && i != j) {
                    graph.get(i).add(j);
                }
            }
            graph.get(i).add(i);
        }
        

        visited = new boolean[P];
        int chains = 0;

        for (int i = 0; i < P; i++) {
            if (!visited[i]) {
                chains++;
                dfs(i);
            }
        }

        System.out.print(chains);
    }

    static void dfs(int node) {
        visited[node] = true;

        for (Integer neighbor : graph.get(node)) {
            if (!visited[neighbor]) {
                dfs(neighbor);
            }
        }
    }
}
