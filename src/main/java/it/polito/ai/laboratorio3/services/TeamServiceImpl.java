package it.polito.ai.laboratorio3.services;

import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import it.polito.ai.laboratorio3.dtos.CourseDTO;
import it.polito.ai.laboratorio3.dtos.StudentDTO;
import it.polito.ai.laboratorio3.dtos.TeamDTO;
import it.polito.ai.laboratorio3.entities.Course;
import it.polito.ai.laboratorio3.entities.Student;
import it.polito.ai.laboratorio3.entities.Team;
import it.polito.ai.laboratorio3.exceptions.*;
import it.polito.ai.laboratorio3.repositories.CourseRepository;
import it.polito.ai.laboratorio3.repositories.StudentRepository;
import it.polito.ai.laboratorio3.repositories.TeamRepository;
import it.polito.ai.laboratorio3.repositories.TokenRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.io.Reader;
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
    ModelMapper modelMapper;


    @Override
    public boolean addCourse(CourseDTO course) {
        Course courseClass = modelMapper.map(course, Course.class);
        if (courseRepository.existsById(courseClass.getName()))
            return false;
        courseRepository.save(courseClass);
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
    public boolean addStudent(StudentDTO student) {
        Student studentClass = modelMapper.map(student, Student.class);
        if (studentRepository.existsById(studentClass.getId()))
            return false;
        studentRepository.save(studentClass);
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
    public List<Boolean> addAll(List<StudentDTO> students) {
        List<Boolean> results = new ArrayList<>();
        students.stream()
                .forEach(studentDTO -> {
                    if(addStudent(studentDTO))
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
            throw new WrongTeamDimensionExcpetion("");
        memberIds.stream()
                .forEach( memberId -> {
                    List<CourseDTO> courses = getCourses(memberId);
                    if (!courses.contains(courseDTO))
                        throw new MemberNotInCourseException();

                    List<TeamDTO> teams = getTeamsForStudent(memberId);
                    long flag = teams.stream()
                            .map(team -> modelMapper.map(team, Team.class))
                            .filter(team -> team.getCourse().getName()==courseId)
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

}
