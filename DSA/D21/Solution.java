import java.util.*;

class Solution {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        int n = s.length();

        String[] suffix = new String[n];
        for (int i = 0; i < n; i++) {
            suffix[i] = s.substring(i);
        }

        Arrays.sort(suffix);

        int maxLen = 0;

        for (int i = 1; i < n - 1; i++) {
            int len = lcp(suffix[i], suffix[i + 1]);
            maxLen = Math.max(maxLen, len);
        }

        System.out.println(maxLen);
    }

    static int lcp(String a, String b) {
        int len = Math.min(a.length(), b.length());
        int i = 0;
        while (i < len && a.charAt(i) == b.charAt(i)) {
            i++;
        }
        return i;
    }
}
