package it.polito.ai.laboratorio3.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import it.polito.ai.laboratorio3.dtos.*;
import it.polito.ai.laboratorio3.entities.*;
import it.polito.ai.laboratorio3.exceptions.*;
import it.polito.ai.laboratorio3.repositories.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.Reader;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class TeamServiceImpl implements TeamService {
    @Autowired
    StudentRepository studentRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    TokenRepository tokenRepository;

    @Autowired
    DocenteRepository docenteRepository;

    @Autowired
    TaskRepository taskRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    EssayRepository essayRepository;

    @Autowired
    VmRepository vmRepository;

    @Autowired
    ImageRepository imageRepository;


    @Override
    public boolean addCourse(CourseDTO course, List<String> ids) {
        Course courseClass = modelMapper.map(course, Course.class);
        if (courseRepository.existsById(courseClass.getName()))
            return false;

        for(String id: ids){
            Optional<Docente> docenteOpt = docenteRepository.findById(id);
            if (!docenteOpt.isPresent())
                throw new DocenteNotFoundException();
            Docente docente = docenteOpt.get();

            courseClass.addDocente(docente);
        }
        return true;
    }

    @Override
    public Optional<CourseDTO> getCourse(String name) {
        return courseRepository.findById(name)
                .map(course -> modelMapper.map(course, CourseDTO.class));
    }

    @Override
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll()
                .stream()
                .map(course -> modelMapper.map(course, CourseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addStudent(StudentDTO student, byte[] studentImg){
        Student studentClass = modelMapper.map(student, Student.class);
        studentClass.setPhotoStudent(studentImg);
        if (studentRepository.existsById(studentClass.getId()))
            return false;
        studentRepository.save(studentClass);
        return true;
    }

    @Override
    public boolean addProfessor(ProfessorDTO professor) {
        Docente docente = modelMapper.map(professor,Docente.class);
        if (docenteRepository.existsById(docente.getId()))
            return false;
        docenteRepository.save(docente);
        return true;
    }

    @Override
    public Optional<StudentDTO> getStudent(String studentId) {
        return studentRepository.findById(studentId)
                .map(student -> modelMapper.map(student,StudentDTO.class));
    }

    @Override
    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll()
                .stream()
                .map(student -> modelMapper.map(student,StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getEnrolledStudents(String courseName) {
        if (!courseRepository.findById(courseName).isPresent())
            throw new CourseNotFoundException();

        return courseRepository.findById(courseName)
                .get()
                .getStudents()
                .stream()
                .map(student -> modelMapper.map(student,StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public boolean addStudentToCourse(String studentId, String courseName) {
        if (!courseRepository.findById(courseName).isPresent())
            throw new CourseNotFoundException();
        if (!studentRepository.findById(studentId).isPresent())
            throw new StudentNotFoundException();
        if(courseRepository.getOne(courseName).getStudents().contains(studentRepository.getOne(studentId)))
            return false;
        else
            courseRepository.getOne(courseName).addStudent(studentRepository.getOne(studentId));
            //studentRepository.getOne(studentId).addCourse(courseRepository.getOne(courseName));
        return true;
    }

    @Override
    //TODO solo l'owner del corso può abilitare e disabilitare il corso
    public void enableCourse(String courseName) {
        if (!courseRepository.findById(courseName).isPresent())
            throw new CourseNotFoundException();
        courseRepository.getOne(courseName).setEnabled(true);
    }

    @Override
    public void disableCourse(String courseName) {
        if (!courseRepository.findById(courseName).isPresent())
            throw new CourseNotFoundException();
        courseRepository.getOne(courseName).setEnabled(false);
    }

    @Override
    public List<Boolean> addAll(List<StudentDTO> students){
        List<Boolean> results = new ArrayList<>();
        students.stream()
                .forEach(studentDTO -> {
                    if(addStudent(studentDTO, new byte[0]))
                        results.add(true);
                    else
                        results.add(false);
                });
        return results;
    }

    @Override
    public List<Boolean> enrollAll(List<String> studentIds, String courseName) {
        if (!courseRepository.findById(courseName).isPresent())
            throw new CourseNotFoundException();
        List<Boolean> results = new ArrayList<>();
        studentIds.stream()
                .forEach(studentId ->{
                    if (addStudentToCourse(studentId,courseName))
                        results.add(true);
                    else
                        results.add(false);
                });
        return results;
    }

    @Override
    public List<Boolean> addAndEroll(Reader r, String courseName) {
        CsvToBean<StudentDTO> csvToBean = new CsvToBeanBuilder(r)
                .withType(StudentDTO.class)
                .withIgnoreLeadingWhiteSpace(true)
                .build();
        List<StudentDTO> students = csvToBean.parse();
        List<String> studentsIds = students.stream()
                .map(StudentDTO::getId)
                .collect(Collectors.toList());
        addAll(students);
        return enrollAll(studentsIds,courseName);
    }

    @Override
    public List<CourseDTO> getCourses(String studentId) {
        if (!studentRepository.findById(studentId).isPresent())
            throw new StudentNotFoundException();
        return studentRepository.findById(studentId).get().getCourses()
                .stream()
                .map(course -> modelMapper.map(course, CourseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<TeamDTO> getTeamsForStudent(String studentId) {
        if (!studentRepository.findById(studentId).isPresent())
            throw new StudentNotFoundException();
        return studentRepository.findById(studentId).get().getTeams()
                .stream()
                .map(team -> modelMapper.map(team,TeamDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getMembers(Long teamId) {
        if (!teamRepository.findById(teamId).isPresent())
            throw new TeamNotFoundException();
        return teamRepository.findById(teamId).get().getMembers()
                .stream()
                .map(student -> modelMapper.map(student,StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public TeamDTO proposeTeam(String courseId, String name, List<String> memberIds) {
        if (!courseRepository.findById(courseId).isPresent())
            throw new CourseNotFoundException();
        CourseDTO courseDTO = modelMapper.map( courseRepository.getOne(courseId) , CourseDTO.class );
        if (!courseDTO.isEnabled())
            throw new CourseNotEnabledException();
        int countMembersMax = courseRepository.getOne(courseId).getMax();
        int countMembersMin = courseRepository.getOne(courseId).getMin();
        if (memberIds.size() > countMembersMax || memberIds.size() < countMembersMin)
            throw new WrongTeamDimensionExcpetion();
        memberIds.stream()
                .forEach( memberId -> {
                    List<CourseDTO> courses = getCourses(memberId);
                    if (!courses.contains(courseDTO))
                        throw new MemberNotInCourseException();

                    List<TeamDTO> teams = getTeamsForStudent(memberId);
                    long flag = teams.stream()
                            .map(team -> modelMapper.map(team, Team.class))
                            .filter(team -> team.getCourse().getName().equals(courseId))
                            .count();
                    if (flag > 0)
                        throw new TeamAlreadyInCourseException();
                } );
        long numDuplicati = memberIds.size() - (memberIds.stream().distinct().count());
        if (numDuplicati>0)
            throw new DuplicatesInListException();

        Team team = new Team();
        team.setCourse(courseRepository.getOne(courseId));
        team.setName(name);
        team.setStatus(NON_ATTIVO);
        memberIds.stream().forEach(memberId -> {
            team.addMember(studentRepository.getOne(memberId));
        });

        team.setMaxVmAccese(4);
        team.setVmAccese(0);
        team.setVcpuUsati(0);
        team.setGBRamUsati(0);
        team.setGBDiskUsati(0);
        team.setGBRamTot(8);
        team.setGBDiskTot(250);
        team.setVcpuTot(4);

        teamRepository.save(team);

        return modelMapper.map(team,TeamDTO.class);
    }

    @Override
    public List<TeamDTO> getTeamForCourse(String courseName) {
        if (!courseRepository.findById(courseName).isPresent())
            throw new CourseNotFoundException();
        return courseRepository.findById(courseName).get().getTeams()
                .stream()
                .map(team -> modelMapper.map(team,TeamDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getStudentsInTeams(String courseName) {
        if (!courseRepository.findById(courseName).isPresent())
            throw new CourseNotFoundException();
        return courseRepository.getStudentsInTeams(courseName)
                .stream()
                .map(student -> modelMapper.map(student,StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<StudentDTO> getAvailableStudents(String courseName) {
        if (!courseRepository.findById(courseName).isPresent())
            throw new CourseNotFoundException();
        return courseRepository.getStudentsNotInTeams(courseName).stream()
                .map(student -> modelMapper.map(student,StudentDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void activeTeam(Long teamId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if(!teamOpt.isPresent())
            throw new TeamNotFoundException();
        teamOpt.get().setStatus(ATTIVO);
    }

    @Override
    public void evictTeam(Long teamId) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if(!teamOpt.isPresent())
            throw new TeamNotFoundException();
        Team team = teamOpt.get();
        team.getMembers()
                .stream()
                .forEach(teamOpt.get()::removeMember);
        teamRepository.delete(team);
    }

    @Override
    public List<TokenDTO> getRequestsForStudent(String id, String name) {
        Optional<Student> studentOpt = studentRepository.findById(id);
        if (!studentOpt.isPresent())
            throw new StudentNotFoundException();
        Student student = studentOpt.get();
       return student.getRequests()
                .stream()
                .filter(req -> req.getCourseName().equals(name))
                .filter( req-> req.getExpiryDate().after(Timestamp.valueOf(LocalDateTime.now())))
                .map(req-> modelMapper.map(req, TokenDTO.class))
                .collect(Collectors.toList());
    }


    @Override
    public String getCourseNameByTeamId(Long id) {
        Optional<Team> teamOpt = teamRepository.findById(id);
        if( !teamOpt.isPresent())
            throw  new TeamNotFoundException();
        Team team = teamOpt.get();
        return team.getCourse().getName();
    }

    @Override
    public void deleteCourse(String name, String username) {
        Optional<Course> courseOpt = courseRepository.findById(name);
        if( !courseOpt.isPresent())
            throw  new CourseNotFoundException();
        Course course = courseOpt.get();
        if(course.getDocenti().stream()
                .filter(doc-> doc.getId().equals(username))
                .count() < 1)
            throw new DocenteHasNotPrivilegeException();

        courseRepository.delete(course);
    }

    @Override
    public CourseDTO updateCourse(String name, CourseDTO dto, List<String> ids) {
        Optional<Course> courseOpt = courseRepository.findById(name);
        if( !courseOpt.isPresent())
            throw  new CourseNotFoundException();
        Course course = courseOpt.get();

        course.setName(dto.getName());
        course.setMax(dto.getMax());
        course.setMin(dto.getMin());

        List<Docente> doc = new ArrayList<>();
        for(String d: ids){
            Optional<Docente> docOpt = docenteRepository.findById(d);
            if( !docOpt.isPresent())
                throw new DocenteNotFoundException();
            doc.add(docOpt.get());
        }
        course.setDocenti(doc);
        return dto;
    }

    @Override
    public void unsubscribeOne(String name, String studentId, String username) {
        Optional<Course> courseOpt = courseRepository.findById(name);
        if( !courseOpt.isPresent())
            throw  new CourseNotFoundException();
        Course course = courseOpt.get();

        if ( course.getDocenti().stream()
        .filter(d-> d.getId().equals(username))
        .count() < 1)
            throw new DocenteHasNotPrivilegeException();

        Optional<Student> studentOpt = studentRepository.findById(studentId);
        if( !studentOpt.isPresent())
            throw  new StudentNotFoundException();
        Student student = studentOpt.get();

        student.unsubscribe(course);
    }

    @Override
    public void unsubscribeMany(String name, List<String> ids, String username) {
        Optional<Course> courseOpt = courseRepository.findById(name);
        if( !courseOpt.isPresent())
            throw  new CourseNotFoundException();
        Course course = courseOpt.get();

        if ( course.getDocenti().stream()
                .filter(d-> d.getId().equals(username))
                .count() < 1)
            throw new DocenteHasNotPrivilegeException();

        for (String id: ids){
            Optional<Student> studentOpt = studentRepository.findById(id);
            studentOpt.ifPresent(student -> student.unsubscribe(course));
        }
    }

    @Override
    public List<VmDTO> getVmsByTeam(String name, Long teamId, String username) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if( !teamOpt.isPresent())
            throw  new TeamNotFoundException();
        Team team = teamOpt.get();

        if(!team.getCourse().getName().equals(name))
            throw new TeamNotFoundException();

        return team.getVms().stream()
                .map(v-> modelMapper.map(v,VmDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public void changeVmsLimit(String name, Long teamId, String username, int vcpus, int GBram, int GBdisk, int maxAccese) {
        Optional<Team> teamOpt = teamRepository.findById(teamId);
        if( !teamOpt.isPresent())
            throw  new TeamNotFoundException();
        Team team = teamOpt.get();

        if(!team.getCourse().getName().equals(name))
            throw new TeamNotFoundException();

        Optional<Course> courseOpt = courseRepository.findById(name);
        if( !courseOpt.isPresent())
            throw  new CourseNotFoundException();
        Course course = courseOpt.get();

        if ( course.getDocenti().stream()
                .filter(d-> d.getId().equals(username))
                .count() < 1)
            throw new DocenteHasNotPrivilegeException();

        if(team.getVcpuUsati() > vcpus || team.getGBDiskUsati() > GBdisk || team.getGBRamUsati() > GBdisk || maxAccese < team.getVmAccese())
            throw new TooManyResourcesUsedException();
        if(vcpus != -1)
            team.setVcpuTot(vcpus);
        if(GBdisk != -1)
            team.setGBDiskTot(GBdisk);
        if(GBram != -1)
        team.setGBRamTot(GBram);
        if(maxAccese != -1)
        team.setMaxVmAccese(maxAccese);
    }

    @Override
    public List<TaskDTO> getTasks(String name) {
        Optional<Course> courseOpt = courseRepository.findById(name);
        if( !courseOpt.isPresent())
            throw  new CourseNotFoundException();
        Course course = courseOpt.get();
        return course.getTasks()
                .stream()
                .map(t-> modelMapper.map(t,TaskDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public TaskDTO getTask(String name, Long taskId, UserDetails userDetails) {
        Optional<Course> courseOpt = courseRepository.findById(name);
        if( !courseOpt.isPresent())
            throw  new CourseNotFoundException();
        Course course = courseOpt.get();
        Optional<Task> taskOpt = course.getTasks().stream()
                .filter(t-> t.getId().equals(taskId))
                .findFirst();
        if (!taskOpt.isPresent())
            throw new TaskNotFoundException();

        if (userDetails.getAuthorities().contains("ROLE_PROFESSOR"))
            return modelMapper.map(taskOpt.get(),TaskDTO.class);
        else {
            if(userDetails.getAuthorities().contains("ROLE_STUDENT")){
                if(taskOpt.get().getEssays().stream()
                        .noneMatch(e -> e.getStudent().getId().equals(userDetails.getUsername()))){
                    //Creare essay
                    Essay essay = new Essay();
                    essay.setVoto(Long.valueOf("-1"));
                    essay.setStato(Essay.stati.Letto);

                    Optional<Student> studentOptional = studentRepository.findById(userDetails.getUsername());
                    if(!studentOptional.isPresent())
                        throw new StudentNotFoundException();
                    essay.setStudent(studentOptional.get());
                    essay.setTask(taskOpt.get());
                    essayRepository.save(essay);
                }
            }
            return modelMapper.map(taskOpt.get(),TaskDTO.class);
        }
    }

    @Override
    public TaskDTO createTask(String name, String username, int days, byte[] bytes) {

        Optional<Course> courseOpt = courseRepository.findById(name);
        if( !courseOpt.isPresent())
            throw  new CourseNotFoundException();
        Course course = courseOpt.get();

        if ( course.getDocenti().stream()
                .filter(d-> d.getId().equals(username))
                .count() < 1)
            throw new DocenteHasNotPrivilegeException();

        Task task = new Task();
        task.setDataRilascio(Timestamp.from(Instant.now()));
        task.setDataScadenza(Timestamp.from(Instant.now().plus(days, ChronoUnit.DAYS)));

        task.setDescription(bytes);

        task.setCourse(course);
        task = taskRepository.save(task);
        course.addTask(task);
        return modelMapper.map(task, TaskDTO.class);
    }

    @Override
    public List<EssayDTO> getEssays(Long taskId){
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if ( !taskOpt.isPresent()){
            throw new TaskNotFoundException();
        }
        Task task = taskOpt.get();
        return task.getEssays().stream()
                .map(e -> modelMapper.map(e,EssayDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public EssayDTO getEssay(Long taskId, Long essayId, UserDetails userDetails) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if ( !taskOpt.isPresent()){
            throw new TaskNotFoundException();
        }
        Task task = taskOpt.get();
        Optional<Essay> essayOpt = task.getEssays().stream()
                .filter(e-> e.getId().equals(essayId))
                .findFirst();
        if (!essayOpt.isPresent())
            throw new EssayNotFoundException();

        if(userDetails.getAuthorities().contains("ROLE_STUDENT")){
            if(essayOpt.get().getStato().equals(Essay.stati.Rivisto)){
                essayOpt.get().setStato(Essay.stati.Letto);
            }
        }
        return modelMapper.map(essayOpt.get(),EssayDTO.class);
    }

    @Override
    public List<VmDTO> getVmsByStudent(String studentId, Long teamId) {
        if(!studentRepository.existsById(studentId))
            throw new StudentNotFoundException();
        Student student = studentRepository.getOne(studentId);

        if(student.getTeams().stream().noneMatch(t-> t.getId().equals(teamId)))
            throw new TeamNotFoundException();
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException();
        Team team = teamRepository.getOne(teamId);

        return team.getVms().stream()
                .map(v-> modelMapper.map(v,VmDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public VmDTO createVm(String id, Long teamId, VmDTO dto, byte[] bytes) {
        if(!studentRepository.existsById(id))
            throw new StudentNotFoundException();
        Student student = studentRepository.getOne(id);

        if(student.getTeams().stream().noneMatch(t-> t.getId().equals(teamId)))
            throw new TeamNotFoundException();
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException();
        Team team = teamRepository.getOne(teamId);

        if(team.getVcpuTot() - team.getVcpuUsati() < dto.getVcpu())
            throw new InsufficientResourcesException();
        if(team.getGBRamTot() - team.getGBRamUsati() < dto.getGBRam())
            throw new InsufficientResourcesException();
        if(team.getGBDiskTot() - team.getGBDiskUsati() < dto.getGBDisk())
            throw new InsufficientResourcesException();

        Vm vm = new Vm();
        if (team.getVmAccese() < team.getMaxVmAccese()){
            vm.setStatus(Vm.stati.Accesa);
            team.setVmAccese(team.getVmAccese()+1);
        }
        else
            vm.setStatus(Vm.stati.Spenta);

        vm.setGBDisk(dto.getGBDisk());
        vm.setGBRam(dto.getGBRam());
        vm.setVcpu(dto.getVcpu());
        vm.setScreenVm(bytes);
        vm.setTeam(team);
        vm = vmRepository.save(vm);
        vm.addOwner(student);
        vm.setIdCreatore(id);
        return modelMapper.map(vm,VmDTO.class);
    }

    @Override
    public void switchVm(String id, Long teamId, Long vmId) {
        if(!studentRepository.existsById(id))
            throw new StudentNotFoundException();
        Student student = studentRepository.getOne(id);

        if(student.getTeams().stream().noneMatch(t-> t.getId().equals(teamId)))
            throw new TeamNotFoundException();
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException();
        Team team = teamRepository.getOne(teamId);
        if(team.getVms().stream().noneMatch(v-> v.getId().equals(vmId)))
            throw new VmNotFoundException();
        if(!vmRepository.existsById(vmId))
            throw new VmNotFoundException();
        Vm vm = vmRepository.getOne(vmId);

        if(vm.getOwners().stream().noneMatch(s-> s.getId().equals(id)))
            throw new StudentHasNotPrivilegeException();

        if(vm.getStatus().equals(Vm.stati.Accesa)) {
            vm.setStatus(Vm.stati.Spenta);
            team.setVmAccese(team.getVmAccese()-1);
        }
        else {
            if(team.getMaxVmAccese() == team.getVmAccese())
                throw new MaxVmAcceseException();
            else
            vm.setStatus(Vm.stati.Accesa);
        }
    }

    @Override
    public void deleteVm(String id, Long teamId, Long vmId) {
        if(!studentRepository.existsById(id))
            throw new StudentNotFoundException();
        Student student = studentRepository.getOne(id);

        if(student.getTeams().stream().noneMatch(t-> t.getId().equals(teamId)))
            throw new TeamNotFoundException();
        if(!teamRepository.existsById(teamId))
            throw new TeamNotFoundException();
        Team team = teamRepository.getOne(teamId);
        if(team.getVms().stream().noneMatch(v-> v.getId().equals(vmId)))
            throw new VmNotFoundException();
        if(!vmRepository.existsById(vmId))
            throw new VmNotFoundException();
        Vm vm = vmRepository.getOne(vmId);

        if(vm.getOwners().stream().noneMatch(s-> s.getId().equals(id)))
            throw new StudentHasNotPrivilegeException();

        team.setGBDiskUsati(team.getGBDiskUsati()-vm.getGBDisk());
        team.setGBRamUsati(team.getGBDiskUsati()-vm.getGBRam());
        team.setVcpuUsati(team.getVcpuUsati()-vm.getVcpu());
        vmRepository.delete(vm);
    }

    @Override
    public byte[] getImage(String id) {
        if(!studentRepository.existsById(id))
            throw new StudentNotFoundException();
        return studentRepository.getOne(id).getPhotoStudent();
    }

    @Override
    public List<ImageDTO> getStorical(String name, Long taskId, Long essayId) {
        if(!courseRepository.existsById(name))
            throw new CourseNotFoundException();
        if(!taskRepository.existsById(taskId))
            throw new TaskNotFoundException();
        Task task = taskRepository.getOne(taskId);
        if(!task.getCourse().getName().equals(name))
            throw new TaskNotFoundException();
        if(task.getEssays().stream().noneMatch(e->e.getId().equals(essayId)))
            throw new EssayNotFoundException();
        Essay essay = essayRepository.getOne(essayId);
        return essay.getImages().stream()
                .map(i-> modelMapper.map(i,ImageDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<ProfessorDTO> getAllProfessor() {
        return docenteRepository.findAll()
                .stream()
                .map(p -> modelMapper.map(p,ProfessorDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public EssayDTO loadEssay(Long taskId, Long essayId, byte[] data, UserDetails userDetails, Long voto) {
        Optional<Task> taskOpt = taskRepository.findById(taskId);
        if ( !taskOpt.isPresent()){
            throw new TaskNotFoundException();
        }
        Task task = taskOpt.get();
        if(task.getEssays().stream().noneMatch(e->e.getId().equals(essayId)))
            throw new EssayNotFoundException();
        Essay essay = essayRepository.getOne(essayId);

        if(essay.getStato().equals(Essay.stati.Terminato))
            throw new EssayNotModifiableException();

        if(userDetails.getAuthorities().contains("ROLE_STUDENT")){
            essay.setStato(Essay.stati.Consegnato);
            essay.setIdStudente(userDetails.getUsername());
        }else{
            if (userDetails.getAuthorities().contains(("ROLE_PROFESSOR"))){

                if(!essay.getStato().equals(Essay.stati.Consegnato))
                    throw new EssayNotLoadedByStudentException();

                if(voto.equals(Long.valueOf("-1"))){
                    essay.setStato(Essay.stati.Rivisto);
                    }
                else{
                    essay.setVoto(voto);
                    essay.setStato(Essay.stati.Terminato);
                }
            }
        }
        Image image = new Image();
        image.setCreationDate(Timestamp.from(Instant.now()));
        image.setData(data);
        image = imageRepository.save(image);
        essay.addImage(image);
        return modelMapper.map(essay,EssayDTO.class);
    }

}
