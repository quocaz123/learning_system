// grading.js - mock data for grading/feedback system

export const submissions = [
    {
        id: 1,
        studentName: 'Nguyễn Văn A',
        studentId: '20210001',
        assignment: 'Bài tập 1: Sorting Algorithm',
        submittedAt: '2024-06-29 14:30',
        status: 'pending',
        code: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

# Test
arr = [64, 34, 25, 12, 22, 11, 90]
print(bubble_sort(arr))`,
        testResults: null,
        grade: null,
        feedback: ''
    },
    {
        id: 2,
        studentName: 'Trần Thị B',
        studentId: '20210002',
        assignment: 'Bài tập 1: Sorting Algorithm',
        submittedAt: '2024-06-29 15:45',
        status: 'graded',
        code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)`,
        testResults: { passed: 8, total: 10, passRate: 80 },
        grade: 85,
        feedback: 'Code chạy tốt nhưng cần cải thiện xử lý edge cases.'
    }
];

export const testCases = [
    { input: '[5, 2, 8, 1, 9]', expected: '[1, 2, 5, 8, 9]' },
    { input: '[1]', expected: '[1]' },
    { input: '[]', expected: '[]' },
    { input: '[3, 3, 3]', expected: '[3, 3, 3]' },
    { input: '[9, 8, 7, 6, 5]', expected: '[5, 6, 7, 8, 9]' }
];

export const rubrics = [
    { criterion: 'Tính đúng đắn', weight: 40, score: 0, maxScore: 10 },
    { criterion: 'Hiệu suất thuật toán', weight: 30, score: 0, maxScore: 10 },
    { criterion: 'Chất lượng code', weight: 20, score: 0, maxScore: 10 },
    { criterion: 'Documentation', weight: 10, score: 0, maxScore: 10 }
]; 