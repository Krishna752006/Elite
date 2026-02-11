import java.util.*;

class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String[] st = sc.nextLine().split(",");
        int n = sc.nextInt();
        Map<String, Integer> mp = new HashMap<>();
        for (String s : st) {
            mp.put(s, mp.getOrDefault(s, 0) + 1);
        }
        PriorityQueue<Map.Entry<String, Integer>> pq =
            new PriorityQueue<>((a, b) -> {
                if (!a.getValue().equals(b.getValue()))
                    return b.getValue() - a.getValue();
                return a.getKey().compareTo(b.getKey());
            });

        pq.addAll(mp.entrySet());
        List<String> li = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            li.add(pq.poll().getKey());
        }
        System.out.println(li);
    }
}   