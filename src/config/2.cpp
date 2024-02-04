class Solution {
public:
    bool isRectangleValid(int x1, int y1, int x2, int y2) {
        return x1 <= x2 && y1 >= y2;
    }

    bool isPointInsideRectangle(int x, int y, int x1, int y1, int x2, int y2) {
        return x1 <= x && x <= x2 && y1 >= y && y >= y2;
    }

    int numberOfPairs(vector<vector<int>>& v1) {
        int n = v1.size();
        int count = 0;

        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                
                int x1 = v1[i][0];
                int y1 = v1[i][1];
                int x2 = v1[j][0];
                int y2 = v1[j][1];

                if (isRectangleValid(x1, y1, x2, y2)) {
                    int flag = 1;
                    for (int k = 0; k < n; k++) {
                        if (k == i || k == j) continue;
                        if (isPointInsideRectangle(v1[k][0], v1[k][1], x1, y1, x2, y2)) {
                            flag = 0;
                            break;
                        }
                    }
                    if (flag) {
                        count++;
                    }
                }
            }
        }
        return count;
    }
};
