// src/data/courses.js

const courses = {
    perl: {
        name: 'Perl Programming',
        description: 'Học lập trình Perl từ cơ bản đến nâng cao',
        chapters: [
            {
                id: 1,
                title: 'Giới thiệu về Perl',
                lessons: [
                    {
                        id: 1,
                        title: 'Tổng quan về Perl',
                        type: 'text',
                        duration: '15 phút',
                        content: {
                            objective: 'Hiểu được lịch sử, ứng dụng và đặc điểm của ngôn ngữ Perl',
                            description: 'Giới thiệu về Perl và các ứng dụng thực tế.',
                            htmlContent: `
                  <h3>Perl là gì?</h3>
                  <p>Perl là một ngôn ngữ linh hoạt và mạnh mẽ...</p>
                `,
                            examples: [
                                {
                                    title: 'Hello World trong Perl',
                                    code: `#!/usr/bin/perl\nprint "Hello, World!\\n";`
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    },
    python: {
        name: 'Python Programming',
        description: 'Học lập trình Python từ cơ bản đến nâng cao',
        chapters: [
            {
                id: 1,
                title: 'Giới thiệu về Python',
                lessons: [
                    {
                        id: 1,
                        title: 'Tổng quan về Python',
                        type: 'text',
                        duration: '18 phút',
                        content: {
                            objective: 'Hiểu được đặc điểm và ứng dụng của Python',
                            description: 'Giới thiệu về ngôn ngữ Python.',
                            htmlContent: `
                  <h3>Python là gì?</h3>
                  <p>Python là một ngôn ngữ lập trình đa năng và dễ học...</p>
                `,
                            examples: [
                                {
                                    title: 'Hello World trong Python',
                                    code: `print("Hello, World!")`
                                }
                            ]
                        }
                    }
                ]
            }
        ]
    }
};

export default courses;
