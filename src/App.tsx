import React, { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  UserCheck, 
  Plus, 
  Trash2, 
  Edit, 
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface Department {
  id: string;
  name: string;
  headInstructorId?: string;
}

interface Instructor {
  id: string;
  name: string;
  email: string;
  departmentId: string;
}

interface Course {
  id: string;
  name: string;
  departmentId: string;
  instructorId: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Timestamp;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Data states
  const [departments, setDepartments] = useState<Department[]>([]);
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  // Real-time listeners
  useEffect(() => {
    const unsubDeps = onSnapshot(collection(db, 'departments'), 
      (snapshot) => setDepartments(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Department))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'departments')
    );

    const unsubInst = onSnapshot(collection(db, 'instructors'), 
      (snapshot) => setInstructors(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Instructor))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'instructors')
    );

    const unsubCourses = onSnapshot(collection(db, 'courses'), 
      (snapshot) => setCourses(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Course))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'courses')
    );

    const unsubStudents = onSnapshot(collection(db, 'students'), 
      (snapshot) => setStudents(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Student))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'students')
    );

    const unsubEnroll = onSnapshot(collection(db, 'enrollments'), 
      (snapshot) => setEnrollments(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Enrollment))),
      (err) => handleFirestoreError(err, OperationType.LIST, 'enrollments')
    );

    return () => {
      unsubDeps();
      unsubInst();
      unsubCourses();
      unsubStudents();
      unsubEnroll();
    };
  }, []);

  // CRUD Operations
  const addDepartment = async (data: { name: string }) => {
    try {
      await addDoc(collection(db, 'departments'), data);
      toast.success('Department added');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'departments');
    }
  };

  const addInstructor = async (data: Omit<Instructor, 'id'>) => {
    try {
      await addDoc(collection(db, 'instructors'), data);
      toast.success('Instructor added');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'instructors');
    }
  };

  const addCourse = async (data: Omit<Course, 'id'>) => {
    try {
      await addDoc(collection(db, 'courses'), data);
      toast.success('Course added');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'courses');
    }
  };

  const addStudent = async (data: Omit<Student, 'id'>) => {
    try {
      await addDoc(collection(db, 'students'), data);
      toast.success('Student added');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'students');
    }
  };

  const enrollStudent = async (studentId: string, courseId: string) => {
    try {
      await addDoc(collection(db, 'enrollments'), {
        studentId,
        courseId,
        enrolledAt: serverTimestamp()
      });
      toast.success('Student enrolled');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'enrollments');
    }
  };

  const setDepartmentHead = async (deptId: string, instructorId: string) => {
    try {
      await updateDoc(doc(db, 'departments', deptId), { headInstructorId: instructorId });
      toast.success('Department head updated');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `departments/${deptId}`);
    }
  };

  const deleteItem = async (col: string, id: string) => {
    try {
      await deleteDoc(doc(db, col, id));
      toast.success('Item deleted');
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `${col}/${id}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl">CollegeDB</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 w-full sm:w-auto">
              <TabsTrigger value="dashboard" className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="departments" className="gap-2">
                <Building2 className="w-4 h-4" />
                <span className="hidden lg:inline">Departments</span>
              </TabsTrigger>
              <TabsTrigger value="instructors" className="gap-2">
                <UserCheck className="w-4 h-4" />
                <span className="hidden lg:inline">Instructors</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="hidden lg:inline">Courses</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden lg:inline">Students</span>
              </TabsTrigger>
              <TabsTrigger value="enrollments" className="gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden lg:inline">Enrollments</span>
              </TabsTrigger>
            </TabsList>

            {activeTab !== 'dashboard' && (
              <AddDialog 
                type={activeTab as any} 
                onAdd={{
                  departments: addDepartment,
                  instructors: addInstructor,
                  courses: addCourse,
                  students: addStudent,
                  enrollments: enrollStudent
                }}
                data={{ departments, instructors, courses, students }}
              />
            )}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="dashboard" className="m-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard title="Departments" value={departments.length} icon={<Building2 className="w-5 h-5" />} />
                  <StatCard title="Instructors" value={instructors.length} icon={<UserCheck className="w-5 h-5" />} />
                  <StatCard title="Courses" value={courses.length} icon={<BookOpen className="w-5 h-5" />} />
                  <StatCard title="Students" value={students.length} icon={<Users className="w-5 h-5" />} />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Enrollments</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {enrollments.slice(0, 5).map(e => (
                          <div key={e.id} className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                                {students.find(s => s.id === e.studentId)?.name.charAt(0)}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{students.find(s => s.id === e.studentId)?.name}</p>
                                <p className="text-xs text-muted-foreground">{courses.find(c => c.id === e.courseId)?.name}</p>
                              </div>
                            </div>
                            <span className="text-[10px] text-muted-foreground">{e.enrolledAt?.toDate().toLocaleDateString()}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Department Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {departments.map(d => (
                          <div key={d.id} className="flex items-center justify-between p-3 bg-white rounded-lg border shadow-sm">
                            <div>
                              <p className="text-sm font-medium">{d.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {instructors.filter(i => i.departmentId === d.id).length} Instructors
                              </p>
                            </div>
                            <Badge variant="outline">
                              {courses.filter(c => c.departmentId === d.id).length} Courses
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="departments" className="m-0">
                <DataTable 
                  title="Departments" 
                  description="Manage college departments and their heads."
                  headers={['Name', 'Head Instructor', 'Actions']}
                  data={departments}
                  renderRow={(dept) => (
                    <TableRow key={dept.id}>
                      <TableCell className="font-medium">{dept.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {instructors.find(i => i.id === dept.headInstructorId)?.name || (
                            <span className="text-muted-foreground italic">No head assigned</span>
                          )}
                          <Dialog>
                            <DialogTrigger render={
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <Edit className="h-3 w-3" />
                              </Button>
                            } />
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Set Department Head</DialogTitle>
                                <DialogDescription>Select an instructor to be the head of {dept.name}.</DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <Select onValueChange={(v: string) => setDepartmentHead(dept.id, v)}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select instructor" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {instructors.filter(i => i.departmentId === dept.id).map(i => (
                                      <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => deleteItem('departments', dept.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                />
              </TabsContent>

              <TabsContent value="instructors" className="m-0">
                <DataTable 
                  title="Instructors" 
                  description="Faculty members and their department affiliations."
                  headers={['Name', 'Email', 'Department', 'Actions']}
                  data={instructors}
                  renderRow={(inst) => (
                    <TableRow key={inst.id}>
                      <TableCell className="font-medium">{inst.name}</TableCell>
                      <TableCell>{inst.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {departments.find(d => d.id === inst.departmentId)?.name || 'Unknown'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem('instructors', inst.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                />
              </TabsContent>

              <TabsContent value="courses" className="m-0">
                <DataTable 
                  title="Courses" 
                  description="Academic courses offered by departments."
                  headers={['Name', 'Department', 'Instructor', 'Actions']}
                  data={courses}
                  renderRow={(course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>{departments.find(d => d.id === course.departmentId)?.name}</TableCell>
                      <TableCell>{instructors.find(i => i.id === course.instructorId)?.name}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem('courses', course.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                />
              </TabsContent>

              <TabsContent value="students" className="m-0">
                <DataTable 
                  title="Students" 
                  description="Registered students in the college."
                  headers={['Name', 'Email', 'Actions']}
                  data={students}
                  renderRow={(student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem('students', student.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                />
              </TabsContent>

              <TabsContent value="enrollments" className="m-0">
                <DataTable 
                  title="Enrollments" 
                  description="Student course enrollment records."
                  headers={['Student', 'Course', 'Enrolled At', 'Actions']}
                  data={enrollments}
                  renderRow={(enroll) => (
                    <TableRow key={enroll.id}>
                      <TableCell className="font-medium">
                        {students.find(s => s.id === enroll.studentId)?.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {courses.find(c => c.id === enroll.courseId)?.name}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {enroll.enrolledAt?.toDate().toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem('enrollments', enroll.id)}>
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )}
                />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
      <Toaster position="top-center" />
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function DataTable<T extends { id: string }>({ 
  title, 
  description, 
  headers, 
  data, 
  renderRow 
}: { 
  title: string; 
  description: string; 
  headers: string[]; 
  data: T[]; 
  renderRow: (item: any) => React.ReactNode 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map(h => <TableHead key={h}>{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={headers.length} className="text-center py-8 text-muted-foreground italic">
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                data.map(renderRow)
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function AddDialog({ 
  type, 
  onAdd, 
  data 
}: { 
  type: 'departments' | 'instructors' | 'courses' | 'students' | 'enrollments';
  onAdd: any;
  data: { departments: Department[], instructors: Instructor[], courses: Course[], students: Student[] }
}) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'enrollments') {
      onAdd[type](formData.studentId, formData.courseId);
    } else {
      onAdd[type](formData);
    }
    setFormData({});
    setOpen(false);
  };

  const renderFields = () => {
    switch (type) {
      case 'departments':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Department Name</Label>
              <Input 
                id="name" 
                required 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
          </div>
        );
      case 'instructors':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Instructor Name</Label>
              <Input 
                id="name" 
                required 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={formData.email || ''} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select 
                required 
                onValueChange={v => setFormData({ ...formData, departmentId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {data.departments.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'courses':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Course Name</Label>
              <Input 
                id="name" 
                required 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label>Department</Label>
              <Select 
                required 
                onValueChange={v => setFormData({ ...formData, departmentId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  {data.departments.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Instructor</Label>
              <Select 
                required 
                onValueChange={v => setFormData({ ...formData, instructorId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select instructor" />
                </SelectTrigger>
                <SelectContent>
                  {data.instructors
                    .filter(i => !formData.departmentId || i.departmentId === formData.departmentId)
                    .map(i => (
                      <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Student Name</Label>
              <Input 
                id="name" 
                required 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                required 
                value={formData.email || ''} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
              />
            </div>
          </div>
        );
      case 'enrollments':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Student</Label>
              <Select 
                required 
                onValueChange={v => setFormData({ ...formData, studentId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {data.students.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select 
                required 
                onValueChange={v => setFormData({ ...formData, courseId: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {data.courses.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add {type.slice(0, -1)}
        </Button>
      } />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New {type.slice(0, -1)}</DialogTitle>
            <DialogDescription>
              Enter the details for the new {type.slice(0, -1)} record.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            {renderFields()}
          </div>
          <DialogFooter>
            <Button type="submit">Save Record</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
