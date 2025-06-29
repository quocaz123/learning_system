// data.js

export const assignments = [
    {
        id: 1,
        title: 'Bài tập 1: Biến và In ra màn hình',
        type: 'code',
        language: 'python',
        dueDate: '2025-07-05',
        status: 'submitted',
        description: 'Viết chương trình Python in ra thông tin cá nhân của bạn',
        requirements: [
            'Khai báo biến tên, tuổi, và quê quán',
            'In ra thông tin theo định dạng yêu cầu',
            'Sử dụng f-string để format chuỗi'
        ],
        starterCode: `# Bài tập 1: Thông tin cá nhân
  # TODO: Khai báo các biến
  name = ""
  age = 0
  hometown = ""
  
  # TODO: In ra thông tin theo format
  # Định dạng: "Tôi tên [tên], [tuổi] tuổi, đến từ [quê quán]"
  `,
        expectedOutput: 'Tôi tên John, 20 tuổi, đến từ Hà Nội'
    },
    {
        id: 2,
        title: 'Bài tập 2: Vòng lặp và Điều kiện',
        type: 'code',
        language: 'perl',
        dueDate: '2025-07-07',
        status: 'pending',
        description: 'Viết chương trình Perl tính tổng các số chẵn từ 1 đến 100',
        requirements: [
            'Sử dụng vòng lặp for',
            'Kiểm tra số chẵn bằng toán tử %',
            'In ra kết quả cuối cùng'
        ],
        starterCode: `#!/usr/bin/perl
  # Bài tập 2: Tính tổng số chẵn
  use strict;
  use warnings;
  
  my $sum = 0;
  # TODO: Viết vòng lặp tính tổng số chẵn từ 1 đến 100
  
  print "Tổng các số chẵn từ 1 đến 100 là: $sum\\n";`,
        expectedOutput: 'Tổng các số chẵn từ 1 đến 100 là: 2550'
    },
    {
        id: 3,
        title: 'Kiểm tra: Cú pháp cơ bản Python',
        type: 'quiz',
        dueDate: '2025-07-10',
        status: 'pending',
        questions: [
            {
                id: 1,
                question: 'Cách khai báo biến số nguyên trong Python?',
                options: ['int x = 5', 'x = 5', 'var x = 5', 'declare x = 5'],
                correct: 1
            },
            {
                id: 2,
                question: 'Hàm nào dùng để in ra màn hình trong Python?',
                options: ['echo()', 'printf()', 'print()', 'write()'],
                correct: 2
            },
            {
                id: 3,
                question: 'Comment trong Python được viết như thế nào?',
                options: ['// Comment', '/* Comment */', '# Comment', '<!-- Comment -->'],
                correct: 2
            }
        ]
    },
    {
        id: 4,
        title: 'Bài tập nộp file: Dự án nhỏ',
        type: 'upload',
        dueDate: '2025-07-15',
        status: 'pending',
        description: 'Tạo một chương trình quản lý danh sách sinh viên',
        requirements: [
            'File nén (.zip) chứa source code',
            'File README.md mô tả cách chạy',
            'Test cases và kết quả mong đợi'
        ],
        maxFileSize: '10MB',
        allowedFormats: ['.zip', '.rar', '.7z']
    }
];

export const codeExamples = {
    python: {
        'Hello World': 'print("Hello, World!")',
        'Biến và kiểu dữ liệu': `# Khai báo biến
  name = "Python"
  version = 3.9
  is_popular = True
  
  print(f"Ngôn ngữ: {name}")
  print(f"Phiên bản: {version}")
  print(f"Phổ biến: {is_popular}")`,
        'Vòng lặp for': `# Vòng lặp qua danh sách
  fruits = ["apple", "banana", "orange"]
  for fruit in fruits:
      print(f"Tôi thích {fruit}")
  
  # Vòng lặp với range
  for i in range(1, 6):
      print(f"Số: {i}")`,
        'Hàm đơn giản': `def greet(name):
      return f"Xin chào, {name}!"
  
  def add_numbers(a, b):
      return a + b
  
  # Sử dụng hàm
  message = greet("Python")
  print(message)
  
  result = add_numbers(5, 3)
  print(f"5 + 3 = {result}")`
    },
    perl: {
        'Hello World': `#!/usr/bin/perl
  print "Hello, World!\\n";`,
        'Biến và kiểu dữ liệu': `#!/usr/bin/perl
  use strict;
  use warnings;
  
  # Scalar variables
  my $name = "Perl";
  my $version = 5.32;
  my $is_powerful = 1;
  
  print "Ngôn ngữ: $name\\n";
  print "Phiên bản: $version\\n";
  print "Mạnh mẽ: " . ($is_powerful ? "Có" : "Không") . "\\n";`,
        'Vòng lặp for': `#!/usr/bin/perl
  use strict;
  use warnings;
  
  # Vòng lặp qua array
  my @fruits = ("apple", "banana", "orange");
  foreach my $fruit (@fruits) {
      print "Tôi thích $fruit\\n";
  }
  
  # Vòng lặp với range
  for my $i (1..5) {
      print "Số: $i\\n";
  }`,
        'Subroutine đơn giản': `#!/usr/bin/perl
  use strict;
  use warnings;
  
  sub greet {
      my $name = shift;
      return "Xin chào, $name!";
  }
  
  sub add_numbers {
      my ($a, $b) = @_;
      return $a + $b;
  }
  
  # Sử dụng subroutine
  my $message = greet("Perl");
  print "$message\\n";
  
  my $result = add_numbers(5, 3);
  print "5 + 3 = $result\\n";`
    }
};
