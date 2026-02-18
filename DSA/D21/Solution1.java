import java.util.*;

class Solution {
    static final long MOD = 1000000007;
    static final long BASE = 31;

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        String s = sc.next();
        System.out.println(longestRepeat(s));
    }

    static int longestRepeat(String s) {
        int n = s.length();
        int low = 1, high = n, ans = 0;

        while (low <= high) {
            int mid = (low + high) / 2;
            if (hasRepeat(s, mid)) {
                ans = mid;
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return ans;
    }

    static boolean hasRepeat(String s, int len) {
        if (len == 0) return true;

        long hash = 0, power = 1;
        Set<Long> seen = new HashSet<>();

        for (int i = 0; i < len; i++) {
            hash = (hash * BASE + s.charAt(i)) % MOD;
            power = (power * BASE) % MOD;
        }

        seen.add(hash);

        for (int i = len; i < s.length(); i++) {
            hash = (hash * BASE - s.charAt(i - len) * power % MOD + MOD) % MOD;
            hash = (hash + s.charAt(i)) % MOD;

            if (!seen.add(hash)) return true;
        }

        return false;
    }
}
