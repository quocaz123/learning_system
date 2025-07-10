 const renderCourseList = () => (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Khóa học của tôi</h1>
          <p className="text-gray-600">Khám phá và đăng ký các khóa học mới</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <div key={course.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {course.language}
                </span>
                {course.enrolled && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span className="text-sm">Đã đăng ký</span>
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 mb-4">{course.description}</p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  <span>{course.lessons} bài học</span>
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  <span>{course.author}</span>
                </div>
              </div>

              {course.enrolled && course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Tiến độ</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                onClick={() => {
                  if (course.enrolled) {
                    setSelectedCourse(course);
                    setCurrentView('courseDetail');
                  } else {
                    enrollCourse(course.id);
                  }
                }}
                className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${course.enrolled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
              >
                {course.enrolled ? 'Vào học' : 'Đăng ký học'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );